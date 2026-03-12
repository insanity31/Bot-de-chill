let handler = async (m, { conn }) => {
    try {
        // Obtenemos todos los newsletters (canales) que el bot conoce
        const newsletters = await conn.newsletterQuery("ALL");
        
        if (!newsletters || newsletters.length === 0) {
            return m.reply("❌ No encontré ningún canal donde el bot esté unido.");
        }

        let txt = "✅ *CANALES ENCONTRADOS:*\n\n";
        for (let res of newsletters) {
            txt += `📢 *Nombre:* ${res.name}\n`;
            txt += `🆔 *ID:* \`${res.id}\`\n`;
            txt += `👤 *Rol:* ${res.role}\n\n`;
        }
        
        txt += "⚠️ *Copia el ID (el que tiene @newsletter) y úsalo en tu código.*";
        await m.reply(txt);

    } catch (e) {
        console.error(e);
        await m.reply("💔 No pude obtener la lista de canales. Asegúrate de que el bot sea administrador.");
    }
}

handler.help = ['listarchat']
handler.tags = ['owner']
handler.command = ['listarchat', 'canales']
handler.owner = true

export default handler
