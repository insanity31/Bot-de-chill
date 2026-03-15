let handler = async (m, { conn, command, isAdmin, isOwner, isBotAdmin }) => {
    // Validaciones de grupo y admin (aunque tu framework ya lo hace abajo, es buen filtro)
    if (!m.isGroup) {
        await m.react('💔')
        return m.reply('💔 Este comando solo funciona en grupos darling~')
    }

    if (!isAdmin && !isOwner) {
        await m.react('💔')
        return m.reply('💔 Solo admins y owner pueden usar este comando mi amor~')
    }

    // ¡NUEVO! Validar que el bot tenga permisos de administrador
    if (!isBotAdmin) {
        await m.react('💔')
        return m.reply('💔 Darling~ necesito ser administradora del grupo para poder dar o quitar poder~')
    }

    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
    if (!who) {
        await m.react('🌸')
        return m.reply('💗 Menciona o responde al usuario que quieres promover/degradar darling~')
    }

    await m.react('🍬')

    try {
        if (command === 'promote') {
            await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
            // ¡CORREGIDO! Se agrega "mentions" para que la etiqueta funcione correctamente
            await conn.sendMessage(m.chat, { text: `💗 *¡PROMOTE APLICADO!* 🌸\n\n@${who.split('@')[0]} ahora es administrador del grupo.`, mentions: [who] }, { quoted: m })
            await m.react('👑')
        } 
        else if (command === 'demote') {
            await conn.groupParticipantsUpdate(m.chat, [who], 'demote')
            // ¡CORREGIDO! Se agrega "mentions" para que la etiqueta funcione correctamente
            await conn.sendMessage(m.chat, { text: `💔 *¡DEMOTE APLICADO!* 🌸\n\n@${who.split('@')[0]} ya no es administrador.`, mentions: [who] }, { quoted: m })
            await m.react('👑')
        }
    } catch (e) {
        console.error(e)
        await m.react('💔')
        m.reply('💔 Uy darling... no pude cambiar el rol esta vez. Asegúrate de que no esté intentando modificar al creador del grupo~')
    }
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['group']
handler.command = ['promote', 'demote']
handler.group = true
handler.admin = true
handler.botAdmin = true // ¡NUEVO! Le dice al bot que exija ser admin antes de ejecutar

export default handler
