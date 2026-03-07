let handler = async (m, { conn, who, prefix, isAdmin, isBotAdmin }) => {
    if (!who) return m.reply(`Menciona o responde a un usuario.\nEjemplo: *${prefix}mute @usuario*`)
    if (!isAdmin) return m.reply('👮 Solo administradores pueden usar este comando.')
    if (!isBotAdmin) return m.reply('🤖 Necesito ser admin para esto.')

    if (!global.db.data.groups) global.db.data.groups = {}
    if (!global.db.data.groups[m.chat]) global.db.data.groups[m.chat] = {}
    if (!global.db.data.groups[m.chat].muted) global.db.data.groups[m.chat].muted = []

    const muted = global.db.data.groups[m.chat].muted

    if (muted.includes(who)) return m.reply('Este usuario ya está muteado.')

    muted.push(who)
    await global.db.save()

    await conn.sendMessage(m.chat, {
        text: `🔇 @${who.split('@')[0]} ha sido muteado.`,
        mentions: [who]
    })
}

handler.command = ['mute']
handler.tags = ['grupos']
handler.group = true

export default handler
