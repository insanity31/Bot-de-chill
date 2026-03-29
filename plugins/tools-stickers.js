import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { downloadMediaMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!mime) {
        await m.react('💎')
        return m.reply(`🗿 ¿que paso master, el sticker me lo invento o que? 👻\nResponde a una imagen/video/gif con\n*${prefix}s*`)
    }

    if (!/image|video/.test(mime)) {
        await m.react('😐')
        return m.reply('😐 Solo imágenes, videos y gifs se pueden convertir\~')
    }

    await m.react('🍬')

    try {
        // ←←← ESTO ES LA CORRECCIÓN ←←←
        let media = await downloadMediaMessage(q, 'buffer', {}, {
            reuploadRequest: conn.updateMediaMessage
        })

        let pack = args.length ? args.join(' ') : (global.packname || '🎭 insanity bot 🎭')
        let author = global.author || '© by insanity31'

        const sticker = new Sticker(media, {
            pack: pack,
            author: author,
            type: StickerTypes.FULL,   // soporta gif/video animado
            categories: ['🗿'],
            quality: 75,
        })

        const buffer = await sticker.toBuffer()

        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        await m.react('🎭')

    } catch (e) {
        console.error('❌ STICKER ERROR:', e)
        await m.react('😐')
        m.reply(`🗿 bro... mi poder de waifu tododopoderosa falló otra vez\n\n*Error:* ${e.message || e}\nInténtalo de nuevo crack\ 🎭`)
    }
}

handler.help = ['s', 'sticker', 'stiker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker', 'stiker']

export default handler
