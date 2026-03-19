import { database } from '../lib/database.js'

let handler = async (m, { command }) => {
    if (!m.isGroup) return m.reply('💔 Este comando solo funciona en grupos darling\~')
    if (!m.isAdmin && !m.isOwner) return m.reply('💔 Solo admins y owner pueden usar este comando')

    if (!database.data.groups[m.chat]) {
        database.data.groups[m.chat] = {}
    }

    const estado = command === 'on' ? true : false

    database.data.groups[m.chat].bot = estado

    const mensaje = estado 
        ? '✅ *Bot activado* en este grupo.\nAhora responderé normalmente a todos.' 
        : '❌ *Bot desactivado* en este grupo.\nSolo responderé a comandos de owner.'

    await m.reply(mensaje)
    await m.react(estado ? '✅' : '❌')
}

handler.help = ['bot on', 'bot off']
handler.tags = ['group']
handler.command = ['bot']
handler.group = true
handler.admin = true

export default handler