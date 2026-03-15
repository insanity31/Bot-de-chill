import fetch from 'node-fetch'

let handler = async (m, { args }) => {
    let texto = args.join(' ').trim()
    if (!texto) {
        await m.react('🌸')
        return m.reply('💗 Escribe algo después del comando darling\~\nEjemplo: *#tts Hola Zero Two, te quiero*')
    }

    await m.react('🍬')

    try {
        const url = `https://api.akuari.my.id/texttospeech/texttospeech?text=${encodeURIComponent(texto)}`
        const res = await fetch(url)
        const json = await res.json()

        if (!json.result) throw new Error('No se generó audio')

        await conn.sendMessage(m.chat, {
            audio: { url: json.result },
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        await m.react('💗')

    } catch (e) {
        console.error(e)
        await m.react('💔')
        m.reply('💔 Uy darling... no pude generar la voz esta vez\~ Prueba con texto más corto')
    }
}

handler.help = ['tts <texto>']
handler.tags = ['tools']
handler.command = ['tts']

export default handler