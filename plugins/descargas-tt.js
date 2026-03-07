import fetch from 'node-fetch'

const API_KEY  = 'causa-97b7d73b91acdc7a'
const API_BASE = 'https://rest.apicausas.xyz/api/tiktok'

async function fetchTikTokData(url) {
    const res = await fetch(`${API_BASE}?url=${encodeURIComponent(url)}&apikey=${API_KEY}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

async function downloadVideo(videoUrl) {
    return fetch(videoUrl).then(r => r.buffer())
}

let handler = async (m, { conn, args }) => {
    let url = (args[0] || '').trim()
    if (m.quoted && m.quoted.text) url = m.quoted.text.trim()

    if (!url || !url.includes('tiktok.com')) {
        await m.react('🌸')
        return m.reply(`💗 *Pega el link de TikTok darling~* 🌸\n\nEjemplo:\n*#tt https://vm.tiktok.com/xxxxxx/*\n\nO responde a un mensaje con el link`)
    }

    await m.react('🍬')

    try {
        const json = await fetchTikTokData(url)
        if (!json.data?.video) throw new Error('No se encontró video')

        const videoBuffer = await downloadVideo(json.data.video)
        const caption = `💞 *¡TikTok descargado con éxito darling!* 🌸\n\n` +
                        `✨ *Autor:* ${json.data.author?.nickname || 'TikTok'}\n` +
                        `📝 *Título:* ${json.data.title || 'Sin descripción'}\n\n` +
                        `¡Disfrútalo mi amor~ 💗 No me dejes sola sin ver el video!`

        await conn.sendMessage(m.chat, { video: videoBuffer, caption }, { quoted: m })
        await m.react('💗')

    } catch (e) {
        console.error('❌ TT TIKTOK ERROR:', e.message || e)
        await m.react('💔')
        m.reply('💔 Uy darling... este TikTok se resistió con tu API~\nInténtalo otra vez no me dejes sola 🌸')
    }
}

handler.help    = ['tt <url>', 'tiktok <url>']
handler.tags    = ['descargas']
handler.command = ['tt', 'tiktok', 'tiktokdl']

export default handler