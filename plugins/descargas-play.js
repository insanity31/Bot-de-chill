import fetch from 'node-fetch'
import axios from 'axios'
import yts   from 'yt-search'

const YT_REGEX = /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtu\.be\/|youtube\.com\/(?:watch|shorts|embed))/i
const THUMB_URL = 'https://raw.githubusercontent.com/nulswa/files/main/icons/icon-youtube.jpg'
const API_KEY = 'sylphy-c0ZDE6V'
const API_BASE = 'https://sylphy.xyz/download'
const SIZE_LIMIT = 10 

async function tryAPI(url) {
  for (let i = 0; i < 2; i++) {
    try {
      const res  = await fetch(url)
      const data = await res.json()
      if (data?.status) return data
    } catch {}
  }
  return null
}

async function getFileSizeMB(url) {
  try {
    const res = await axios.head(url, { timeout: 8000 })
    const bytes = parseInt(res.headers['content-length'] || '0', 10)
    return bytes ? bytes / (1024 * 1024) : 0
  } catch { return 0 }
}

function formatSize(bytes) {
  if (!bytes || isNaN(bytes)) return 'Desconocido'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++ }
  return `${bytes.toFixed(2)} ${units[i]}`
}

function cleanFileName(title) {
  return title.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_')
}

async function resolveYouTubeURL(input) {
  if (YT_REGEX.test(input)) return input

  const result = await yts(input)
  const video  = result?.videos?.[0]
  if (!video?.url) return null
  return video.url
}


let handler = async (m, { conn, text, args, usedPrefix, command }) => {

  const isAudio = /^(play|ytmp3|mp3)$/i.test(command)
  const tipo    = isAudio ? 'MP3' : 'MP4'
  const label   = isAudio ? 'YouTube : MP3' : 'YouTube : MP4'

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `📍 Envía un enlace o el nombre de la canción/video.\n\n` +
            `*Ejemplos:*\n` +
            `• *${usedPrefix}${command}* https://youtube.com/watch?v=xxx\n` +
            `• *${usedPrefix}${command}* Never Gonna Give You Up`
    }, { quoted: m })
  }

  await m.react('⏰')
  let ytURL
  try {
    ytURL = await resolveYouTubeURL(text.trim())
  } catch (e) {
    return conn.sendMessage(m.chat, { text: `❌ Error buscando en YouTube: ${e.message}` }, { quoted: m })
  }

  if (!ytURL) {
    return conn.sendMessage(m.chat, {
      text: `❌ No se encontraron resultados para: *${text}*`
    }, { quoted: m })
  }
  const endpoint = isAudio
    ? `${API_BASE}/v2/ytmp3?url=${encodeURIComponent(ytURL)}&api_key=${API_KEY}`
    : `${API_BASE}/ytmp4?url=${encodeURIComponent(ytURL)}&api_key=${API_KEY}`

  const data = await tryAPI(endpoint)

  if (!data?.result?.dl_url) {
    await m.react('❌')
    return conn.sendMessage(m.chat, {
      text: `❌ No se pudo obtener el enlace de descarga.\n- La API puede estar ocupada, intenta de nuevo.`
    }, { quoted: m })
  }

  const { title, dl_url } = data.result
  const fileName = cleanFileName(title)
  const fileSizeMB = await getFileSizeMB(dl_url)
  const sizeLabel = fileSizeMB ? formatSize(fileSizeMB * 1024 * 1024) : 'Desconocido'

  // ── Mensaje de info ─────────────────────────────────────────────────────
  const infoText = [
    `· ┄ · ⊸ 𔓕 *YouTube  :  Download*`,
    ``,
    `> ${title}`,
    ``,
    `𝇈 *Fuente* » YouTube`,
    `𝇈 *Formato* » ${tipo}`,
    `𝇈 *Tamaño* » ${sizeLabel}`,
    ``,
    `> Insanity - youtube`,
  ].join('\n')

  try {
    const thumbBuf = Buffer.from(await (await fetch(THUMB_URL)).arrayBuffer())
    await conn.sendMessage(m.chat, {
      text: infoText,
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          title: `⧿ ${label} ⧿`,
          body: "Insanity",
          thumbnail: thumbBuf,
          sourceUrl: ytURL,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      },
    }, { quoted: m })
  } catch {
    await conn.sendMessage(m.chat, { text: infoText }, { quoted: m })
  }

  const overLimit = fileSizeMB >= SIZE_LIMIT

  if (isAudio) {
    if (overLimit) {
      await conn.sendMessage(m.chat, {
        document: { url: dl_url },
        mimetype: 'audio/mpeg',
        fileName: `${fileName}.mp3`,
        caption: `📍 Enviado como documento por superar *${SIZE_LIMIT}MB*.`,
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        audio: { url: dl_url },
        mimetype: 'audio/mpeg',
        fileName: `${fileName}.mp3`,
      }, { quoted: m })
    }
  } else {
    if (overLimit) {
      await conn.sendMessage(m.chat, {
        document: { url: dl_url },
        mimetype: 'video/mp4',
        fileName: `${fileName}.mp4`,
        caption:  `📍 Enviado como documento por superar *${SIZE_LIMIT}MB*.`,
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video:    { url: dl_url },
        mimetype: 'video/mp4',
        fileName: `${fileName}.mp4`,
        caption:  `· ┄ · ⊸ 𔓕 *YouTube : Download*\n\n> ${title}\n\n> Insanity`,
      }, { quoted: m })
    }
  }

  await m.react('✅')
}

handler.command = ['play', 'ytmp3', 'mp3', 'play2', 'ytmp4', 'mp4']
handler.tags = ['descargas']

export default handler
