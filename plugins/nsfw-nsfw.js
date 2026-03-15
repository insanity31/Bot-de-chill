import axios from 'axios'
import { database } from '../lib/database.js'

const API_MAP = {
    'neko': 'https://api.waifu.pics/nsfw/neko',
    'trap': 'https://api.waifu.pics/nsfw/trap',
    'blowjob': 'https://api.waifu.pics/nsfw/blowjob',
    'hentai': 'https://api.waifu.im/search?is_nsfw=true&included_tags=hentai',
    'ero': 'https://api.waifu.im/search?is_nsfw=true&included_tags=ero',
    'ass': 'https://api.waifu.im/search?is_nsfw=true&included_tags=ass',
    'paizuri': 'https://api.waifu.im/search?is_nsfw=true&included_tags=paizuri',
    'oral': 'https://api.waifu.im/search?is_nsfw=true&included_tags=oral',
    'milf': 'https://api.waifu.im/search?is_nsfw=true&included_tags=milf',
    'ecchi': 'https://api.waifu.im/search?is_nsfw=true&included_tags=ecchi',
    'tetas': 'https://nekobot.xyz/api/image?type=boobs',
    'pechos': 'https://nekobot.xyz/api/image?type=boobs',
    'pussy': 'https://nekobot.xyz/api/image?type=pussy',
    'culo': 'https://nekobot.xyz/api/image?type=ass',
    'gonewild': 'https://nekobot.xyz/api/image?type=gonewild',
    '4k': 'https://nekobot.xyz/api/image?type=4k'
}

const NSFW_COMMANDS = Object.keys(API_MAP)

let handler = async (m, { conn, command }) => {
    if (!database.data.groups?.[m.chat]?.nsfw && m.isGroup) {
        return m.reply('🚫 El contenido NSFW está desactivado en este grupo.\n\nUn admin puede activarlo con *#nable nsfw on*')
    }

    const apiUrl = API_MAP[command]
    if (!apiUrl) return

    try {
        const { data } = await axios.get(apiUrl)

        const imageUrl = data.url || data.message || (data.images && data.images[0]?.url)

        if (!imageUrl) throw new Error('No se obtuvo URL de imagen')

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `*${command.toUpperCase()}*`
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('❌ Error al obtener el contenido.')
    }
}

handler.help = NSFW_COMMANDS
handler.tags = ['nsfw']
handler.command = NSFW_COMMANDS
handler.group = true

export default handler