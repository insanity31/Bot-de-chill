let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]+)/i

const isNumber = (x) => !isNaN(parseInt(x))

let handler = async (m, { conn, text, isOwner }) => {
  try {
    if (!text) return m.reply('♡ Darling... pásame un enlace de grupo 💗')

    // 💗 Buscar link en TODO el texto
    let match = text.match(linkRegex)
    if (!match) return m.reply('♡ Mmm... ese enlace no es válido Darling 💔')

    let code = match[1]

    // 💗 Días opcionales
    let parts = text.trim().split(/\s+/)
    let daysStr = parts.find(x => /^\d+$/.test(x))
    let days = 0

    if (isOwner) {
      days = daysStr ? Math.min(999, Math.max(1, parseInt(daysStr))) : 0
    } else {
      days = 3
    }

    // 💌 Unirse al grupo
    let groupId = await conn.groupAcceptInvite(code)

    // 💗 Nombre del grupo
    let groupName = groupId
    try {
      let meta = await conn.groupMetadata(groupId)
      if (meta?.subject) groupName = meta.subject
    } catch {}

    // 💾 DB segura
    global.db = global.db || {}
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}

    let chats = global.db.data.chats
    chats[groupId] = chats[groupId] || {}

    if (days > 0) {
      chats[groupId].expired = Date.now() + days * 86400000
    } else {
      delete chats[groupId].expired
    }

    // 💬 Confirmación
    await m.reply(`♡ Ya entré a *${groupName}*...\n♡ ${days ? `Me quedaré ${days} día(s) contigo 💗` : 'Me quedaré contigo, Darling... 💗'}`)

    // 🎥 Mensaje Zero Two
    let media = 'https://files.catbox.moe/sjak3i.jpg'
    let texto = `╭━━━〔 ♡ 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 ♡ 〕━━━⬣
┃ ❥ Ya llegué, Darling... 💗
┃ ❥ Ahora este grupo es más divertido~
┃ ❥ Llámame si me necesitas
╰━━━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(groupId, {
      video: { url: media },
      gifPlayback: true,
      caption: texto,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('♡ No pude entrar... quizá el enlace expiró o ya estoy dentro 💔')
  }
}

handler.help = ['join <link> [días]']
handler.tags = ['owner']
handler.command = ['join', 'entrar']
handler.owner = true

export default handler