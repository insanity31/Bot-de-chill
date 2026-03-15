import fetch from 'node-fetch'
import { database } from '../lib/database.js'

let handler = async (m, { conn }) => {

    if (!database.data.groups?.[m.chat]?.nsfw)
        return m.reply('🚫 El contenido NSFW está desactivado.\n\nUn admin debe usar *.on nsfw*.')

    await m.react('👿')

    let res = await fetch('https://nekobot.xyz/api/image?type=pussy')
    let json = await res.json()

    if (!json.success) {
        await m.react('🎈')
        return m.reply('Error al obtener la imagen.')
    }

    let img = json.message

    await conn.sendMessage(
        m.chat,
        { image: { url: img } },
        { quoted: m }
    )

    await m.react('🤮')
}

handler.help = ['pussy']
handler.tags = ['nsfw']
handler.command = ['pussy']
handler.group = true

export default handler