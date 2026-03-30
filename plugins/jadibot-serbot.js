import path from 'path'
import fs from 'fs'
import { database } from '../lib/database.js'
import {
    makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} from '@whiskeysockets/baileys'
import { smsg } from '../lib/simple.js'
import { handler as msgHandler, loadEvents } from '../handler.js'
import pino from 'pino'

if (!Array.isArray(global.conns)) global.conns = []

const MAX_SUBBOTS = 15
const MAX_PER_USER = 2
const COOLDOWN_MS = 120000

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function isSocketReady(sock) {
    if (!sock) return false
    return sock.ws?.socket?.readyState === 1 && !!sock.user?.jid
}

function cleanPhone(jid) {
    return jid?.replace(/[^0-9]/g, '') || null
}

const handler = async (m, { conn, args, prefix }) => {
    const userId = m.sender
    const now = Date.now()

    if (!database.data.users[userId]) database.data.users[userId] = {}
    if (!database.data.users[userId].Subs) database.data.users[userId].Subs = 0

    const lastUse = database.data.users[userId].Subs
    if (now - lastUse < COOLDOWN_MS) {
        const remaining = msToTime(COOLDOWN_MS - (now - lastUse))
        return m.reply(`${global.vs}\n\n  ◇ Espera antes de usar este comando.\n  ✧ Tiempo restante › ${remaining}`)
    }

    const activeCount = global.conns.filter(c => isSocketReady(c)).length
    if (activeCount >= MAX_SUBBOTS) {
        return m.reply(`${global.vs}\n\n  ◇ Límite de SubBots alcanzado.\n  ✧ Activos › ${activeCount} / ${MAX_SUBBOTS}`)
    }

    const userPhone = cleanPhone(m.sender)
    if (userPhone) {
        const userCount = global.conns.filter(c =>
            isSocketReady(c) && cleanPhone(c.user?.jid) === userPhone
        ).length
        if (userCount >= MAX_PER_USER) {
            return m.reply(`${global.vs}\n\n  ◇ Ya tienes el máximo de SubBots activos.\n  ✧ Tus activos › ${userCount} / ${MAX_PER_USER}\n  › Usa ${prefix}stop para desconectar uno`)
        }
    }

    const targetPhone = m.sender.split('@')[0]
    const sessionPath = path.join(global.subBotsDir || './Sessions/SubBots', targetPhone)
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })

    database.data.users[userId].Subs = now

    await m.reply(`${global.vs}\n\n  ◇ Generando código para +${targetPhone}...\n  › Abre WhatsApp › Dispositivos vinculados › Vincular con número de teléfono`)

    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
        const { version } = await fetchLatestBaileysVersion()
        const logger = pino({ level: 'silent' })

        const sock = makeWASocket({
            version,
            logger,
            printQRInTerminal: false,
            browser: Browsers.macOS('Chrome'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger)
            },
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async () => '',
            keepAliveIntervalMs: 45000
        })

        sock.sessionPath = sessionPath
        sock.ev.on('creds.update', saveCreds)

        let codeGenerated = false

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
            const reason = lastDisconnect?.error?.output?.statusCode

            if (qr && !codeGenerated) {
                codeGenerated = true
                try {
                    let secret = await sock.requestPairingCode(targetPhone)
                    secret = secret?.match(/.{1,4}/g)?.join('-') || secret

                    const msgCode = await conn.sendMessage(m.chat, {
                        text: `${global.vs}\n\n  ◆ Código de emparejamiento\n\n  ✧ Número › +${targetPhone}\n\n  > ${secret}\n\n  › Tienes 60 segundos para ingresarlo\n  › Abre WhatsApp › Dispositivos vinculados › Vincular con número de teléfono`
                    }, { quoted: m })

                    if (msgCode?.key) {
                        setTimeout(() => conn.sendMessage(m.chat, { delete: msgCode.key }).catch(() => {}), 60000)
                    }
                } catch (e) {
                    console.error('Error generando code:', e.message)
                    await m.reply(`${global.vs}\n\n  ◇ Error al generar código › ${e.message}`)
                }
                return
            }

            if (connection === 'open') {
                sock.startTime = Date.now()
                await loadEvents(sock).catch(() => {})

                const idx = global.conns.findIndex(c => c.sessionPath === sessionPath)
                if (idx !== -1) global.conns.splice(idx, 1)
                global.conns.push(sock)

                await conn.sendMessage(m.chat, {
                    text: `${global.vs}\n\n  ◆ Conexión exitosa\n  ✧ Usuario › ${sock.user?.name || targetPhone}\n  ✧ Subbots activos › ${global.conns.length}`
                }, { quoted: m }).catch(() => {})
            }

            if (connection === 'close') {
                global.conns = global.conns.filter(c => c.sessionPath !== sessionPath)

                if ([
                    DisconnectReason.connectionLost,
                    DisconnectReason.connectionClosed,
                    DisconnectReason.restartRequired,
                    DisconnectReason.timedOut,
                    DisconnectReason.badSession
                ].includes(reason)) {
                    global.startSubBot?.(sessionPath)
                } else if ([DisconnectReason.loggedOut, DisconnectReason.forbidden].includes(reason)) {
                    fs.rmSync(sessionPath, { recursive: true, force: true })
                } else {
                    global.startSubBot?.(sessionPath)
                }
            }
        })

        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            try {
                if (type !== 'notify') return
                let msg = messages[0]
                if (!msg?.message) return
                if (Object.keys(msg.message)[0] === 'ephemeralMessage') {
                    msg.message = msg.message.ephemeralMessage.message
                }
                if (msg.key?.remoteJid === 'status@broadcast') return
                if (msg.key?.id?.startsWith('BAE5') && msg.key.id.length === 16) return
                msg = smsg(sock, msg)
                await msgHandler(msg, sock, global.plugins)
            } catch (e) {
                console.error('Error mensaje subbot:', e.message)
            }
        })

    } catch (e) {
        console.error('Error jadibot:', e.message)
        await m.reply(`${global.vs}\n\n  ◇ Error › ${e.message}`)
    }
}

handler.help = ['code']
handler.tags = ['serbot']
handler.command = ['code', 'serbot']

export default handler