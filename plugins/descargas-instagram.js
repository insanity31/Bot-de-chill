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

async function fetchData(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "*/*",
      "Accept-Language": "es-ES,es;q=0.9",
      "Referer": "https://www.instagram.com/",
      "Origin": "https://www.instagram.com",
      "Connection": "keep-alive"
      // 🔥 OPCIONAL (MEJORA MUCHO):
      // "Cookie": "sessionid=TU_SESSION_ID"
    }
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

function extractVideo(html) {
  let results = []

  // 🔥 Método 1: og:video
  let og = html.match(/property="og:video" content="([^"]+)"/)
  if (og) results.push(clean(og[1]))

  // 🔥 Método 2: JSON video_url
  let json = html.match(/"video_url":"([^"]+)"/g)
  if (json) {
    json.forEach(x => {
      let url = x.split('"')[3]
      results.push(clean(url))
    })
  }

  // 🔥 Método 3: display_resources (fallback)
  let fallback = html.match(/https:\/\/[^"]+\.cdninstagram\.com[^"]+/g)
  if (fallback) {
    fallback.forEach(x => results.push(clean(x)))
  }

  return [...new Set(results)]
}

async function fallbackAPI(url) {
  try {
    let api = url.split('?')[0] + '?__a=1&__d=dis'
    let res = await fetchData(api)
    let json = JSON.parse(res)

    let media = json?.graphql?.shortcode_media

    if (media?.video_url) return media.video_url

    if (media?.edge_sidecar_to_children?.edges) {
      for (let x of media.edge_sidecar_to_children.edges) {
        if (x.node.video_url) return x.node.video_url
      }
    }

    return null
  } catch {
    return null
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

    // 🔥 fallback si no encuentra
    if (videos.length === 0) {
      let fb = await fallbackAPI(url)
      if (fb) videos.push(fb)
    }

    if (videos.length === 0) throw new Error('NO_VIDEO')

    await conn.sendMessage(m.chat, {
      video: { url: videos[0] },
      caption: '✅ Video descargado (Instagram PRO)'
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
      msg += '💡 Usa cookies (sessionid) para mejorar'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['ig', 'instagram']

export default handler