let handler = async (m, { conn, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('💔 Solo funciona en grupos darling\~')
    if (!isAdmin && !isOwner) return m.reply('💔 Solo admins y owner pueden usar este comando')

    await m.react('⌛')

    const group = await conn.groupMetadata(m.chat)
    const participants = group.participants

    // Filtramos usuarios que no son admins (inactivos = no admins)
    const inactivos = participants.filter(p => !p.admin).map(p => p.id)

    if (inactivos.length === 0) {
        return m.reply('✅ No hay usuarios inactivos en este grupo.')
    }

    let txt = `⚠️ *${inactivos.length} USUARIOS INACTIVOS DETECTADOS*\n\n`
    inactivos.forEach(id => txt += `• @${id.split('@')[0]}\n`)
    txt += `\nSi no se conectan en 1 hora tal vez sean eliminados.\n\n¿Quieres eliminarlos ahora?`

    const buttonMessage = {
        text: txt,
        footer: 'Zero Two Bot',
        buttons: [{
            buttonId: 'confirmar_eliminar_inactivos',
            buttonText: { displayText: 'Eliminar Inactivos' },
            type: 1
        }],
        headerType: 1,
        mentions: inactivos
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

    // Enviar al canal oficial (rcanal)
    const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'
    await conn.sendMessage(CANAL, {
        text: `⚠️ *Inactivos detectados*\nGrupo: ${group.subject}\nCantidad: ${inactivos.length}\nUsuarios: ${inactivos.map(id => '@' + id.split('@')[0]).join(' ')}`
    })
}

handler.help = ['inactivos']
handler.tags = ['group']
handler.command = ['inactivos']
handler.group = true
handler.admin = true

export default handler