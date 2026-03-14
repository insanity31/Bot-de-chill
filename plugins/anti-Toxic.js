let handler = m => {
    if (!m.isGroup) return true
    if (m.isAdmin || m.isOwner) return true

    let user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { toxicWarn: 0 })

    const toxicWords = ['puta', 'puto', 'mierda', 'joder', 'pendejo', 'gilipollas', 'cabron', 'zorra', 'verga', 'coño', 'culo', 'maricon', 'hdp', 'hijo de puta']

    const texto = m.text.toLowerCase()

    if (toxicWords.some(word => texto.includes(word))) {
        console.log(`[ANTI-TOXIC] Detectado en ${m.sender}`) // ← para que veas en consola si funciona

        user.toxicWarn = (user.toxicWarn || 0) + 1

        // Borra el mensaje tóxico siempre
        conn.sendMessage(m.chat, { delete: m.key })

        if (user.toxicWarn === 1) {
            m.reply(`⚠️ *Primera advertencia darling!* 🌸\nNo uses palabras tóxicas o te saco del grupo.`)
            m.react('⚠️')
        } 
        else if (user.toxicWarn === 2) {
            m.reply(`⚠️ *¡Segunda advertencia!* 🌸\nYa van dos... la próxima te echo sin piedad.`)
            m.react('⚠️')
        } 
        else if (user.toxicWarn >= 3) {
            m.reply(`💥 *¡TERCERA Y ÚLTIMA ADVERTENCIA!* 💔\nLo siento darling, pero te tengo que sacar del grupo.`)
            conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            user.toxicWarn = 0
            m.react('💥')
        }
    }
    return true
}

handler.before = true
handler.group = true

export default handler