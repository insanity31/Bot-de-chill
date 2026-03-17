let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+(\d{1,3}))?/i

const isNumber = (x) => !isNaN(parseInt(x))

let handler = async (m, { conn, text, isOwner }) => {
  try {
    if (!text) return m.reply('♡ Darling... necesito un enlace de grupo 💗')

    let match = text.match(linkRegex)
    if (!match) return m.reply('♡ Ese enlace no es válido... intenta otra vez')

    let [, code, daysStr] = match

    // 💗 Días configurables
    let days = 0
    if (isOwner) {
      days = daysStr && isNumber(daysStr)
        ? Math.min(999, Math.max(1, parseInt(daysStr)))
        : 0
    } else {
      days = 3
    }

    // 💌 Unirse al grupo
    let groupId = await conn.groupAcceptInvite(code)

    // 💗 Obtener nombre del grupo (sin romper si falla)
    let groupName = groupId
    try {
      let meta = await conn.groupMetadata(groupId)
      if (meta?.subject) groupName = meta.subject
    } catch {}

    // 💾 Asegurar DB
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
    await m.reply(`♡ Me uní a *${groupName}*...\n♡ ${days ? `Estaré aquí por ${days} día(s) 💗` : 'Me quedaré contigo, Darling... 💗'}`)

    // 🎥 Mensaje al grupo estilo Zero Two
    let media = 'https://files.catbox.moe/sjak3i.jpg'
    let texto = `╭━━━〔 ♡ 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 ♡ 〕━━━⬣
┃ ❥ Ya llegué, Darling... 💗
┃ ❥ Espero que me trates bien~
┃ ❥ Usa mis comandos si me necesitas
╰━━━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(groupId, {
      video: { url: media },
      gifPlayback: true,
      caption: texto,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('♡ Mmm... algo salió mal Darling, intenta otra vez 💔')
  }
}

handler.help = ['join <link> [días]']
handler.tags = ['owner']
handler.command = ['join', 'entrar']
handler.owner = true

export default handler