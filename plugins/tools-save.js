let handler = async (m, { conn }) => {
    // Validamos que el usuario esté respondiendo a un mensaje
    if (!m.quoted) {
        await m.react('⚠️')
        return m.reply('Bro, tienes que responder al mensaje (texto, imagen, audio o video) que quieres guardar.')
    }

    await m.react('📦')

    try {
        // Obtenemos el objeto del mensaje citado para poder reenviarlo
        let msgToSave = await m.getQuotedObj()
        
        // El bot reenvía el mensaje al DM del usuario (m.sender)
        await conn.copyNForward(m.sender, msgToSave, false)
        
        // Le avisamos en el grupo que ya se lo mandamos
        await m.reply('✅ ¡Listo bro! Te acabo de enviar este mensaje a nuestro chat privado para que no se te pierda. 📩')
        
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('Uy, no pude enviártelo al privado. 😅\n\n*Nota:* Si nunca me has hablado por privado, mándame un "Hola" primero para que WhatsApp me deje enviarte mensajes.')
    }
}

handler.help = ['save', 'guardar']
handler.tags = ['utilidad']
handler.command = ['save', 'guardar', 'priv']

export default handler
