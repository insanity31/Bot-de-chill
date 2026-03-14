let handler = async (m, { conn, args, isOwner }) => {
    if (!isOwner) {
        await m.react('💔')
        return m.reply('💔 Solo mi owner puede usar este comando darling\~')
    }

    let link = args[0]
    if (!link || !link.includes('chat.whatsapp.com')) {
        await m.react('🌸')
        return m.reply('💗 Envía el link de invitación del grupo después del comando darling\~\nEjemplo: *#join https://chat.whatsapp.com/xxxxxx*')
    }

    await m.react('🍬')

    try {
        let result = await conn.groupAcceptInvite(link)
        
        await m.reply(`✅ *¡Me uní al grupo correctamente darling!* 💕\n\n` +
                      `📍 Grupo: ${result}\n` +
                      `¡Ya estoy dentro\~ no me dejes sola ahí! 🌸`)
        
        await m.react('💗')

    } catch (e) {
        console.error(e)
        await m.react('💔')
        m.reply('💔 No pude unirme al grupo darling...\nEl link puede estar vencido, inválido o el bot ya está en el grupo.')
    }
}

handler.help = ['join <link>']
handler.tags = ['owner']
handler.command = ['join', 'unirse']
handler.owner = true

export default handler