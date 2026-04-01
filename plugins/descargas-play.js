import axios from 'axios'
import yts from 'yt-search'

const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const query = args.join(' ').trim()

  if (!query) {
    return conn.sendMessage(
      msg.chat,
      { text: `✳️ Usa:\n${usedPrefix}${command} <nombre del audio>` },
      { quoted: msg }
    )
  }

  await conn.sendMessage(
    msg.chat,
    { text: '*🎧 Buscando audio...*' },
    { quoted: msg }
  )

  try {
    const search = await yts(query)
    if (!search.videos?.length) throw new Error('No se encontró el audio.')

    const video = search.videos[0]

    const api = `https://nex-magical.vercel.app/download/y?url=${encodeURIComponent(video.url)}`
    const { data } = await axios.get(api)

    if (!data?.status || !data?.result?.status || !data?.result?.url)
      throw new Error('Error en descarga.')

    const title = data.result.info?.title || video.title || 'audio'
    const thumbnail = video.thumbnail || video.image || null

    const info = `🎵 *${title}*\n` +
      `👤 Canal: ${video.author?.name || 'Desconocido'}\n` +
      `⏱️ Duración: ${video.timestamp || 'N/A'}\n` +
      `👀 Vistas: ${video.views?.toLocaleString() || 'N/A'}\n` +
      `🔗 ${video.url}`

    if (thumbnail) {
      await conn.sendMessage(
        msg.chat,
        {
          image: { url: thumbnail },
          caption: info
        },
        { quoted: msg }
      )
    } else {
      await conn.sendMessage(
        msg.chat,
        { text: info },
        { quoted: msg }
      )
    }

    await conn.sendMessage(
      msg.chat,
      {
        audio: { url: data.result.url },
        mimetype: 'audio/mpeg',
        fileName: `${sanitizeFilename(title)}.mp3`
      },
      { quoted: msg }
    )

  } catch (e) {
    await conn.sendMessage(
      msg.chat,
      { text: `❌ Error:\n${e.message}` },
      { quoted: msg }
    )
  }
}

handler.help = ['play <título>', 'ytmp3 <título>']
handler.tags = ['download']
handler.command = ['play', 'ytamp3']

export default handler

function sanitizeFilename(name = 'audio') {
  return name.replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 100)
}