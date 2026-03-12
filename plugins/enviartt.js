import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    let url = args[0] || (m.quoted && m.quoted.text ? m.quoted.text.trim() : '')
    
    if (!url || !url.includes('tiktok.com')) {
        await m.react('🌸')
        return m.reply('💗 Pega el link de TikTok después del comando darling\~\nEjemplo: *#enviartt https://vt.tiktok.com/...*')
    }

    await m.react('🍬')

    try {
        // API 1 (principal)
        let apiUrl = `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (json.code === 0 && json.data?.video) {
            // Éxito con API 1
            const videoBuffer = await fetch(json.data.video).then(r => r.buffer())
            await enviarAlCanal(conn, videoBuffer, json.data.title || 'Sin título', m)
            return
        }

        // API 2 (backup ultra estable)
        console.log('API 1 falló, probando backup...')
        apiUrl = `https://api.fgmods.xyz/api/downloader/tiktok?url=${encodeURIComponent(url)}`
        res = await fetch(apiUrl)
        json = await res.json()

        if (json.result?.video) {
            const videoBuffer = await fetch(json.result.video).then(r => r.buffer())
            await enviarAlCanal(conn, videoBuffer, json.result.title || 'Sin título', m)
            return
        }

        throw new Error('Ninguna API devolvió video')

    } catch (e) {
        console.error('ENVIARTT ERROR FINAL:', e.message || e)
        await m.react('💔')
        m.reply('💔 Uy darling... probé 2 APIs y ninguna funcionó con este link\~\nPrueba con otro TikTok o avísame')
    }
}

// Función para enviar al canal
async function enviarAlCanal(conn, videoBuffer, title, m) {
    const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'

    await conn.sendMessage(CANAL, {
        video: videoBuffer,
        caption: `💗 *TikTok enviado por \( {m.pushName}*\n\n \){title}`
    })

    await m.reply('✅ Video enviado correctamente a tu canal oficial darling\~ 💕')
    await m.react('💗')
}

handler.help = ['enviartt <link>']
handler.tags = ['descargas']
handler.command = ['enviartt', 'ttsend', 'enviartiktok']
handler.owner = true

export default handler