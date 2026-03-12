let handler = async (m, { conn }) => {
    try {
        // Busca la info del canal en el mensaje reenviado
        let jid = m.message.extendedTextMessage.contextInfo.forwardedNewsletterMessageInfo.newsletterJid;
        await m.reply(`✅ *El ID real de tu canal es:*\n\n${jid}\n\nCópialo y ponlo en tu variable CANAL darling~`);
    } catch (e) {
        await m.reply('💔 Uy, no funcionó. Asegúrate de responder a un mensaje que hayas **reenviado directamente desde tu canal**.');
    }
}

handler.help = ['idcanal']
handler.tags = ['owner']
handler.command = ['idcanal']
handler.owner = true

export default handler
