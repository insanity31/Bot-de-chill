import fetch from 'node-fetch'

function isFacebook(url = '') {
  return /facebook\.com|fb\.watch/i.test(url)
}

async function getFBVideo(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "es-ES,es;q=0.9"
    }
  })

  const html = await res.text()

  let hd = html.match(/"playable_url_quality_hd":"([^"]+)"/)
  let sd = html.match(/"playable_url":"([^"]+)"/)

  const clean = (str) => str?.replace(/\\u0025/g, '%').replace(/\\\//g, '/')

  if (hd) return clean(hd[1])
  if (sd) return clean(sd[1])

  throw new Error('No se encontró video')
}

let handler = async (m, { conn, args }) => {
  try {
    const url = args[0]

    if (!url) return m.reply('⚠️ Ingresa un link de Facebook')
    if (!isFacebook(url)) return m.reply('❌ Link inválido')

    await m.reply('⏳ Descargando video...')

    const videoUrl = await getFBVideo(url)

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: '✅ Video descargado'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al descargar el video')
  }
}

handler.command = ['fb']

export default handler