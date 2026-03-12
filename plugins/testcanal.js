let handler = async (m, { conn }) => {
    await m.reply('Buscando canales y enviando prueba... espera un momento darling~')
    try {
        // Intentamos obtener la lista de canales de la memoria del bot
        const newsletters = await conn.newsletterQuery("ALL").catch(() => [])
        
        if (newsletters.length === 0) {
            return m.reply('❌ No encontré ningún canal en la lista oficial. Asegúrate de que el bot sea admin.')
        }

        let lista = "✅ *Canales encontrados:*\n\n"
        
        for (let res of newsletters) {
            lista += `📢 *Nombre:* ${res.name}\n🆔 *ID:* \`${res.id}\`\n\n`
            
            // Enviamos un mensaje de prueba a cada canal para que lo reconozcas
            await conn.sendMessage(res.id, { text: `✨ ¡Hola! Si ves este mensaje, el ID de este canal es:\n${res.id}` })
        }

        await m.reply(lista + "⚠️ Revisa tus canales, en uno de ellos llegó el ID.")

    } catch (e) {
        console.error(e)
        // Plan B: Si falla la consulta oficial, buscamos en los chats recientes
        let chats = Object.keys(conn.chats).filter(id => id.endsWith('@newsletter'))
        if (chats.length > 0) {
            m.reply(`Encontré estos IDs en chats recientes:\n\n${chats.join('\n')}`)
        } else {
            m.reply('💔 No pude encontrar nada. Prueba el método manual de WhatsApp Web.')
        }
    }
}

handler.command = ['testcanal', 'miscanales']
handler.owner = true
export default handler
