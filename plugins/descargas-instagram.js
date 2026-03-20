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
  return url.includes('.mp4')
}

function getHeaders() {
  return {
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "es-ES,es;q=0.9",
    "X-IG-App-ID": "936619743392459",
    "Referer": "https://www.instagram.com/",
    "Origin": "https://www.instagram.com",
    "Connection": "keep-alive"
  }
}

function getShortcode(url) {
  let match = url.match(/\/(reel|p)\/([^\/]+)/)
  return match ? match[2] : null
}

async function fetchHTML(url) {
  const res = await fetch(url, { headers: getHeaders() })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

function extractFromHTML(html) {
  let results = []

  let og = html.match(/property="og:video" content="([^"]+)"/)
  if (og) results.push(clean(og[1]))

  let json = html.match(/"video_url":"([^"]+)"/g)
  if (json) {
    json.forEach(x => results.push(clean(x.split('"')[3])))
  }

  return [...new Set(results)]
}

async function tryGraphQL(shortcode) {
  try {
    const variables = {
      shortcode,
      fetch_tagged_user_count: null,
      hoisted_comment_id: null,
      hoisted_reply_id: null
    }

    const url = `https://www.instagram.com/graphql/query/?query_hash=2b0673e0dc4580674a88d426fe00ea90&variables=${encodeURIComponent(JSON.stringify(variables))}`

    const res = await fetch(url, { headers: getHeaders() })
    if (!res.ok) return null

    const json = await res.json()
    const media = json?.data?.shortcode_media

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

    let videos = []
    const shortcode = getShortcode(url)

    if (shortcode) {
      let gql = await tryGraphQL(shortcode)
      if (gql) videos.push(gql)
    }

    if (videos.length === 0) {
      let html = await fetchHTML(url)
      videos.push(...extractFromHTML(html))
    }

    videos = videos.filter(v => isValidVideo(v))

    let valid = videos[0] || null

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
    } else {
      msg += '🚫 Instagram bloqueó el acceso\n'
      msg += '💡 Prueba con otro reel público'
    }

    await m.reply(msg)
  }
}

handler.command = ['ig']
export default handler