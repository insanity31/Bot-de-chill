import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    // Detecta cualquier mensaje que empiece con "hola" (o variaciones comunes)
    const texto = m.text.toLowerCase().trim()
    if (!texto.startsWith('hola')) return

    try {
        const audioPath = path.join(process.cwd(), 'media', 'saludo-zero-two.opus')

        if (!fs.existsSync(audioPath)) {
            await m.react('💔')
            return m.reply('💔 Uy darling... mi voz se quedó sin batería\~ Inténtalo más tarde 🌸')
        }

        // Envía el audio como nota de voz (ptt: true)
        await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true,
            contextInfo: {
                externalAdReply: {
                    title: 'Zero Two 💗',
                    body: '¡Hola darling\~!',
                    thumbnailUrl: 'https://causas-files.vercel.app/fl/xxbz.jpg',
                    sourceUrl: 'https://github.com/zoredevteam-ctrl/Zore-two'
                }
            }
        }, { quoted: m })

        await m.react('💗')

    } catch (e) {
        console.error('VOZ HOLA ERROR:', e)
        await m.react('💔')
        m.reply('💔 Uy darling... mi voz se trabó\~ Prueba otra vez no me dejes sola 🌸')
    }
}

handler.customPrefix = /^(hola)/i
handler.command = new RegExp  // Para que entre con cualquier "hola..." sin comando específico

handler.help = ['hola']
handler.tags = ['voz', 'main']
handler.limit = false  // No consume límite

export default handler