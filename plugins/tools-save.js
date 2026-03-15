let handler = async (m, { conn }) => {
    // 1. Verificamos que esté respondiendo a algo
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!m.quoted) {
        await m.react('⚠️')
        return m.reply('💗 Darling~ tienes que responder al mensaje que quieres guardar.')
    }

    await m.react('📦')

    try {
        // Obtenemos el mensaje real que se quiere reenviar
        let msg = await m.getQuotedObj()
        
        // Usamos copyNForward que es el método más estable
        // m.sender es el ID del usuario que pidió el save
        await conn.copyNForward(m.sender, msg, true)
        
        await m.react('🍬')
        await m.reply('✅ ¡Listo mi amor! Ya te lo envié al privado. Revisa nuestro chat~ 🌸')

    } catch (e) {
        console.error("Error en el comando save:", e)
        await m.react('💔')
        
        // Si falla el reenvío automático, intentamos enviarlo como un mensaje nuevo
        try {
            await conn.sendMessage(m.sender, { text: `Aquí tienes lo que querías guardar, darling:\n\n${m.quoted.text || ''}` }, { quoted: m.quoted.fakeObj })
            await m.reply('✅ Te envié el texto al privado, pero no pude "reenviar" el mensaje original (quizás es un archivo muy grande o no hemos hablado antes).')
        } catch (err2) {
            m.reply('💔 No pude enviarte nada al privado. Por favor, mándame un "Hola" allá primero para desbloquear el chat.')
        }
    }
}

handler.help = ['save']
handler.tags = ['utilidad']
handler.command = ['save', 'guardar', 'priv']
handler.group = true 

export default handler
