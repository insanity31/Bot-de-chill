const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

const isNumber = (x) => !isNaN(x) && !isNaN(parseInt(x))

let handler = async (m, { conn, text, isOwner, usedPrefix }) => {
  try {
    if (!text) {
      return m.reply(
        `♡ Darling... pásame un enlace de grupo 💗\n\nEjemplo:\n${usedPrefix}join https://chat.whatsapp.com/ABCDEFGHIJK123456789 7`
      )
    }

    // 🔍 Extraer código del link
    let match = text.match(linkRegex)
    if (!match) {
      return m.reply(
        '♡ Mmm... ese enlace no parece válido 💔\nAsegúrate que sea un enlace de WhatsApp'
      )
    }

    let code = match[1]

    // 📅 Días
    let days = 3 // default

    if (isOwner) {
      let args = text.replace(linkRegex, '').trim().split(/\s+/)
      let num = args.find(isNumber)

      if (num) {
        days = Math.max(1, Math.min(999, parseInt(num)))
      }
    }

    // 🚪 Unirse al grupo
    let groupId
    try {
      groupId = await conn.groupAcceptInvite(code)
    } catch (err) {
      let msg = err?.message || ''

      if (msg.includes('already')) {
        return m.reply('♡ Ya estoy en ese grupo, Darling 💗')
      }
      if (msg.includes('expired') || msg.includes('invalid')) {
        return m.reply('♡ El enlace está expirado o inválido 💔')
      }

      throw err
    }

    if (!groupId || !groupId.endsWith('@g.us')) {
      return m.reply('♡ No obtuve un ID válido 💔')
    }

    // 📛 Nombre del grupo
    let groupName = 'Grupo desconocido'
    try {
      let meta = await conn.groupMetadata(groupId)
      groupName = meta?.subject || groupName
    } catch {}

    // 💾 Guardar en DB
    global.db ||= { data: {} }
    global.db.data ||= {}
    global.db.data.chats ||= {}

    let chats = global.db.data.chats
    chats[groupId] ||= {}

    if (days > 0) {
      chats[groupId].expired = Date.now() + days * 86400000
      chats[groupId].joinDate = Date.now()
    } else {
      delete chats[groupId].expired
    }

    // ✅ Confirmación
    await m.reply(
      `♡ Ya entré a *${groupName}* 💗\n` +
      (days
        ? `Me quedaré ${days} día(s) contigo~`
        : 'Me quedaré para siempre contigo, Darling ♡')
    )

    // 🎬 Bienvenida
    let media = 'https://files.catbox.moe/sjak3i.jpg'

    let welcomeText = `╭━━━〔 ♡ 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 ♡ 〕━━━⬣
┃ ❥ Ya llegué, Darling... 💗
┃ ❥ Ahora este grupo es más divertido~
┃ ❥ Llámame si me necesitas ♡
╰━━━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(groupId, {
      video: { url: media },
      gifPlayback: true,
      caption: welcomeText,
      mentions: [m.sender]
    })

  } catch (e) {
    console.error('[join]', e)

    let msg = '♡ No pude entrar... 💔\n'
    let errMsg = e?.message || ''

    if (errMsg.includes('already')) msg += 'Ya estoy en ese grupo~'
    else if (errMsg.includes('expired')) msg += 'El enlace expiró...'
    else if (errMsg.includes('limit')) msg += 'Límite de uniones alcanzado...'
    else msg += 'Error inesperado'

    await m.reply(msg)
  }
}

handler.help = ['join <link> [días]']
handler.tags = ['owner']
handler.command = /^(join|entrar)$/i
handler.owner = false
handler.group = false
handler.private = true

export default handler