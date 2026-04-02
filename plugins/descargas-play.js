import ytdl from 'ytdl-core'

// ... dentro del try, después de obtener url y title

const type = ["play", "yta", "ytmp3", "playaudio"].includes(command) ? "audio" : "video"

await conn.sendMessage(m.chat, { text: `⚽ Procesando...` }, { quoted: m })

let stream
let mimetype
let filename

if (type === "audio") {
  stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
  mimetype = 'audio/mpeg'
  filename = `${title}.mp3`
} else {
  stream = ytdl(url, { filter: 'videoandaudio', quality: 'highest' })
  mimetype = 'video/mp4'
  filename = `${title}.mp4`
}

await conn.sendMessage(
  m.chat,
  {
    document: stream,
    fileName: filename,
    mimetype: mimetype
  },
  { quoted: m }
)
