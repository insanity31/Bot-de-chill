let handler = async (m, { conn }) => {
    // 1. Verificamos que esté respondiendo a algo
    if (!m.quoted) {
        await m.react('⚠️')
        return m.reply('💗 Darling~ tienes que responder al mensaje que quieres guardar para que te lo mande al privado.')
    }

    await m.react('📦')

    try {
        // 2. Obtenemos el ID del chat privado del usuario
        let userJid = m.sender

        // 3. Reenviamos el mensaje citado (m.quoted.fakeObj es el estándar más compatible)
        await conn.copyNForward(userJid, m.quoted.fakeObj, true)
        
        // 4. Confirmación visual
        await m.reply('✅ ¡Listo mi amor! Ya te lo envié al privado. Revisa nuestro chat~ 🌸')
        await m.react('🍬')

    } catch (e) {
        console.error("Error en el comando save:", e)
        await m.react('💔')
        
        // Error común: el usuario no ha iniciado chat con el bot
        m.reply('💔 Uy darling... no pude enviártelo. Asegúrate de haberme enviado al menos un "Hola" al privado para que WhatsApp me deje hablarte.')
    }
}

handler.help = ['save', 'guardar']
handler.tags = ['utilidad']
handler.command = ['save', 'guardar', 'priv']
handler.group = true // Solo tiene sentido usarlo en grupos

export default handler
