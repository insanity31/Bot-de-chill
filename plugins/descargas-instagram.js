import fetch from 'node-fetch'

function isInstagram(url = '') {
  return /instagram\.com/i.test(url)
}

function clean(str = '') {
  return str
    .replace(/\\u0026/g, '&')
    .replace(/\\u003d/g, '=')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
}

function isValidVideo(url = '') {
  return url.includes('.mp4') && url.includes('cdninstagram')
}

async function fetchData(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
      "Accept": "*/*",
      "Accept-Language": "es-ES,es;q=0.9",
      "Referer": "https://www.instagram.com/"
    }
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

function extractVideo(html) {
  let results = []

  let og = html.match(/property="og:video" content="([^"]+)"/)
  if (og) results.push(clean(og[1]))

  let json = html.match(/"video_url":"([^"]+)"/g)
  if (json) {
    json.forEach(x => {
      let url = x.split('"')[3]
      results.push(clean(url))
    })
  }

  return [...new Set(results)]
}

async function checkVideo(url) {
  try {
    let res = await fetch(url, { method: 'HEAD' })
    let size = res.headers.get('content-length')
    return size && parseInt(size) > 50000
  } catch {
    return false
  }
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de Instagram')
  if (!isInstagram(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    const html = await fetchData(url)
    let videos = extractVideo(html)

    videos = videos.filter(v => isValidVideo(v))

    let valid = null

    for (let v of videos) {
      if (await checkVideo(v)) {
        valid = v
        break
      }
    }

    if (!valid) throw new Error('NO_VIDEO')

    await conn.sendMessage(m.chat, {
      video: { url: valid },
      caption: '✅ Video descargado'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    let msg = '❌ Error\n\n'

    if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n' + e.message
    } else if (e.message === 'NO_VIDEO') {
      msg += '🚫 Instagram bloqueó el scraping\n'
      msg += '💡 Prueba otro link o más tarde'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['ig']

export default handler