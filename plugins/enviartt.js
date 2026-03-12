import fetch from 'node-fetch'

// Tu configuración
const LINK_CANAL = 'https://whatsapp.com/channel/0029Vb6p68rF6smrH4Jeay3Y'
const API_KEY = 'causa-ec43262f206b3305'

let handler = async (m, { conn, args }) => {
    let url = args[0] || (m.quoted && m.quoted.text ? m.quoted.text.trim() : '')
    
    if (!url || !url.includes('tiktok.com')) {
        return m.reply('💗 *Darling, necesito un link de TikTok.*\n\nEjemplo: `#enviartt https://vt.tiktok.com/...` o responde a un link con el comando.')
    }

    await m.react('⏳')

    try {
        // 1. Obtener el ID REAL del canal usando el link (AUTOMÁTICO)
        let inviteCode = LINK_CANAL.split('/').pop()
        let metadata = await conn.newsletterMetadata("invite", inviteCode).catch(e => {
            console.error("Error al obtener metadata:", e)
            return null
        })

        if (!metadata || !metadata.id) {
            throw 'No pude encontrar el ID del canal. Asegúrate de que el bot sea administrador.'
        }

        const JID_CANAL = metadata.id // Aquí ya tenemos el 120363...

        // 2. Descargar el video de TikTok
        const res = await fetch(`https://rest.apicausas.xyz/api/v1/descargas/tiktok?url=${encodeURIComponent(url)}&apikey=${API_KEY}`)
        const json = await res.json()

        if (!json.status) throw 'La API de TikTok no respondió correctamente.'

        const videoUrl = json.data.download.url
        const videoRes = await fetch(videoUrl)
        const buffer = await videoRes.buffer()

        // 3. Enviar al canal oficial
        await conn.sendMessage(JID_CANAL, {
            video: buffer,
            caption: `💗 *TikTok de:* ${json.data.autor}\n📝 ${json.data.titulo}\n\n✨ _Enviado por Zero Two Bot_`,
            mimetype: 'video/mp4',
            fileName: `video.mp4`
        })

        await m.react('✅')
        await m.reply(`✨ ¡Video enviado con éxito al canal:\n*${metadata.name}*!`)

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`💔 *Error:* ${e.message || e}\n\n_Revisa que la Bot sea Administradora en el canal._`)
    }
}

handler.help = ['enviartt <link>']
handler.tags = ['owner']
handler.command = ['enviartt', 'sendtt']
handler.owner = true

export default handler
