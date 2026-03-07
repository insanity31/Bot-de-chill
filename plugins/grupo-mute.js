import { database } from '../lib/database.js'

let handler = async (m, { conn, prefix, isAdmin, isBotAdmin }) => {
    let who
    if (m.mentionedJid?.length > 0) {
        who = m.mentionedJid[0]
    } else if (m.quoted) {
        who = m.quoted.sender
    }

    if (!who) return m.reply(`Menciona o responde a un usuario.\nEjemplo: *${prefix}mute @usuario*`)
    if (!isAdmin) return m.reply('👮 Solo administradores pueden usar este comando.')
    if (!isBotAdmin) return m.reply('🤖 Necesito ser admin para esto.')

    if (who.endsWith('@lid') || isNaN(who.split('@')[0])) {
        try {
            const groupMeta = await conn.groupMetadata(m.chat)
            const found = groupMeta.participants.find(p => p.id === who || p.lid === who)
            if (found?.jid) who = found.jid
        } catch {}
    }

    if (!database.data.groups) database.data.groups = {}
    if (!database.data.groups[m.chat]) database.data.groups[m.chat] = {}
    if (!database.data.groups[m.chat].muted) database.data.groups[m.chat].muted = []

    const muted = database.data.groups[m.chat].muted

    if (muted.includes(who)) return m.reply('Este usuario ya está muteado.')

    muted.push(who)
    await database.save()

    await conn.sendMessage(m.chat, {
        text: `🔇 @${who.split('@')[0]} ha sido muteado.`,
        mentions: [who]
    })
}

handler.command = ['mute']
handler.tags = ['grupos']
handler.group = true

export default handler
