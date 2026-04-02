import fetch from "node-fetch"
import yts from "yt-search"

const API_KEY = "Nose-xd"
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/
const COST = 10
const MAX_AUDIO = 16 * 1024 * 1024
const MAX_VIDEO = 64 * 1024 * 1024

const botname = "insanity bot"
const dev = "insanity31"

const handler = async (m, { conn, command }) => {
  const text = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || ""
  
  try {
    if (!text || !text.trim()) {
      return await conn.sendMessage(m.chat, { text: "⚽ Ingresa el nombre o enlace del video.\n\n📌 Ejemplo: .play Bad Bunny" }, { quoted: m })
    }

    const user = global.db.data.users[m.sender]

    if ((user.coin || 0) < COST) {
      const faltante = COST - (user.coin || 0)
      return await conn.sendMessage(
        m.chat,
        { text: `⚽ No tienes suficientes monedas.\n\n💎 Necesitas: *${COST}*\n💎 Tienes: *${user.coin || 0}*\n💎 Te faltan: *${faltante}*` },
        { quoted: m }
      )
    }

    let videoIdToFind = text.match(youtubeRegexID)
    let ytSearch = await yts(videoIdToFind ? "https://youtu.be/" + videoIdToFind[1] : text)

    if (videoIdToFind) {
      ytSearch =
        ytSearch.all.find(v => v.videoId === videoIdToFind[1]) ||
        ytSearch.videos.find(v => v.videoId === videoIdToFind[1])
    }

    ytSearch = ytSearch.all?.[0] || ytSearch.videos?.[0] || ytSearch
    if (!ytSearch) return await conn.sendMessage(m.chat, { text: "✧ No se encontraron resultados." }, { quoted: m })

    const { title, thumbnail, timestamp, views, ago, url } = ytSearch
    const vistas = formatViews(views)

    const thumb = thumbnail ? await getBuffer(thumbnail) : null

    const type = ["play", "yta", "ytmp3", "playaudio"].includes(command) ? "audio" : "video"

    await conn.sendMessage(
      m.chat,
      {
        text: `⚽ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱\n> 🎬 *${title}*\n> 👁️ *${vistas}*\n> ⏱️ *${timestamp}*\n> 📅 *${ago}*\n\n⚽ Procesando archivo...`,
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: dev,
            mediaType: 1,
            mediaUrl: url,
            sourceUrl: url,
            thumbnail: thumb,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    const api = `https://rest.apicausas.xyz/api/v1/descargas/youtube?url=${encodeURIComponent(url)}&type=${type}&apikey=${API_KEY}`

    const res = await fetch(api)
    const json = await res.json()

    // ✅ VALIDACIONES MEJORADAS
    if (!json) {
      throw new Error("La API no respondió")
    }

    if (!json.status) {
      throw new Error(`API: ${json.message || "Error desconocido"}`)
    }

    if (!json.data || !json.data.download || !json.data.download.url) {
      console.log("Respuesta API:", JSON.stringify(json, null, 2))
      throw new Error("La API no devolvió la URL de descarga")
    }

    const dlUrl = json.data.download.url

    let fileSize = 0
    try {
      const headRes = await fetch(dlUrl, { method: 'HEAD' })
      fileSize = parseInt(headRes.headers.get('content-length') || '0')
    } catch (_) {}

    if (type === "audio") {
      if (fileSize > MAX_AUDIO) {
        await conn.sendMessage(
          m.chat,
          {
            document: { url: dlUrl },
            fileName: `${title}.mp3`,
            mimetype: "audio/mpeg"
          },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: dlUrl },
            fileName: `${title}.mp3`,
            mimetype: "audio/mpeg",
            ptt: false
          },
          { quoted: m }
        )
      }
    } else {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: dlUrl },
          fileName: `${title}.mp4`,
          mimetype: "video/mp4"
        },
        { quoted: m }
      )
    }

    user.coin = (user.coin || 0) - COST

    await conn.sendMessage(
      m.chat,
      { text: `⚽ Descarga completada.\n💎 Se descontaron *${COST}* monedas.\n💎 Cartera actual: *${user.coin}*` },
      { quoted: m }
    )
  } catch (e) {
    console.error("Error:", e)
    await conn.sendMessage(m.chat, { text: `⚠︎ Error: ${e.message}` }, { quoted: m })
  }
}

handler.command = handler.help = [
  "play",
  "yta",
  "ytmp3",
  "playaudio",
  "play2",
  "ytv",
  "ytmp4"
]
handler.tags = ["descargas"]
handler.group = true
handler.reg = true

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k`
  return views.toString()
}

async function getBuffer(url) {
  const res = await fetch(url)
  const buffer = await res.buffer()
  return buffer
         }
