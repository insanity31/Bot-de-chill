let handler = async (m, { conn, text }) => {
    // Extraemos el código del link (lo que va después de /channel/)
    let code = text.split('/').pop();
    
    if (!code || !text.includes('whatsapp.com/channel/')) {
        return m.reply('💖 Darling, pega el link de tu canal.\nEjemplo: `#getid https://whatsapp.com/channel/0029Vb6p68rF6smrH4Jeay3Y`');
    }

    try {
        // Esta función le pide a WhatsApp los datos reales del canal
        let res = await conn.newsletterMetadata("invite", code);
        
        let txt = `✅ *INFORMACIÓN DEL CANAL:*\n\n`;
        txt += `📢 *Nombre:* ${res.name}\n`;
        txt += `🆔 *ID:* \`${res.id}\`\n`;
        txt += `👥 *Seguidores:* ${res.subscribers}\n\n`;
        txt += `⚠️ *Copia el ID (el que tiene @newsletter) y ponlo en tu script de TikTok.*`;
        
        await m.reply(txt);
    } catch (e) {
        console.error(e);
        await m.reply('💔 No pude obtener el ID. Asegúrate de que el link sea correcto o que el bot no esté baneado de ver canales.');
    }
}

handler.help = ['getid <link>']
handler.tags = ['owner']
handler.command = ['getid', 'infocanal']
handler.owner = true

export default handler
