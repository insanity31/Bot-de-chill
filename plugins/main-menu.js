import fs from 'fs'
import fetch from 'node-fetch'
import { database } from '../lib/database.js'
import { pathToFileURL } from 'url'

const handler = async (m, { conn }) => {
    try {
        const botname = global.botname || global.botName || 'Zero Two'
        const pluginFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js'))
        const grouped = {}

        for (const file of pluginFiles) {
            try {
                const plugin = (await import(pathToFileURL(`./plugins/${file}`).href)).default
                const tags = plugin?.tags || ['misc']
                const cmd = plugin?.command?.[0] || file.replace('.js', '')
                for (const tag of tags) {
                    if (!grouped[tag]) grouped[tag] = []
                    grouped[tag].push(cmd)
                }
            } catch {
                const cmd = file.replace('.js', '')
                if (!grouped['misc']) grouped['misc'] = []
                grouped['misc'].push(cmd)
            }
        }

        const totalCmds = Object.values(grouped).flat().length
        const totalUsers = Object.keys(database.data.users || {}).length
        const registeredUsers = Object.values(database.data.users || {}).filter(u => u.registered).length

        const seccionesTexto = Object.entries(grouped).map(([tag, cmds]) =>
`𖤐 *${tag.toUpperCase()}*\n${cmds.map(c => `  ꕦ ${c}`).join('\n')}\n`
        ).join('\n')

        const zonaHoraria = 'America/Caracas'
        const hora = parseInt(new Date().toLocaleTimeString('es-CO', { timeZone: zonaHoraria, hour: '2-digit', hour12: false }))

        let saludo, carita
        if (hora >= 5 && hora < 12) {
            saludo = 'buenos días'
            carita = '(＊^▽^＊) ☀️'
        } else if (hora >= 12 && hora < 18) {
            saludo = 'buenas tardes'
            carita = '(｡•̀ᴗ-)✧ 🕒'
        } else {
            saludo = 'buenas noches'
            carita = '(◕‿◕✿) 🌙'
        }

        const menuTexto = `𖤐 ❖ 404_ℐ𝓃𝓈𝒶𝓃𝒾𝓉𝓎_ℬℴ𝓉  𝐌𝐄𝐍𝐔 ❖ 𖤐
❝ ¡Hola *${m.pushName}*, ${saludo}~! ${carita}
Soy *${botname}* y este es mi menú,
más te vale usarlo bien... ehh🗿 ❞
ꙮ *Comandos:* ${totalCmds} disponibles
ꙮ *Usuarios:* ${totalUsers} conocidos
ꙮ *Registrados:* ${registeredUsers} loquitos

${seccionesTexto}
𖤐 *insanity bot* 🎭 (´｡• ᵕ •｡\`)`.trim()

        const response = await fetch('https://causas-files.vercel.app/fl/d3tg.jpg')
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64 = buffer.toString('base64')

        await conn.sendMessage(m.chat, {
            document: buffer,
            mimetype: 'application/pdf',
            fileName: `『 Insanity  Menu 』.pdf`,
            fileLength: 2199023255552,
            pageCount: 2026,
            caption: menuTexto,
            mentions: [m.sender],
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: '404_ℐ𝓃𝓈𝒶𝓃𝒾𝓉𝓎_ℬℴ𝓉 ',
                    body: 'locura 🎭',
                    mediaType: 1,
                    thumbnail: base64,
                    renderLargerThumbnail: true,
                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6p68rF6smrH4Jeay3Y'
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363404822730259@newsletter',
                    newsletterName: 'insanity bot',
                    serverMessageId: -1
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('😐 Bro, algo salió mal al generar el menú... prueba de nuevo')
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'ayuda']
export default handler
