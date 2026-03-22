let handler = async (m, { conn, who, prefix }) => {
    if (!who) return m.reply(`👁️ 𝕰𝖙𝖎𝖖𝖚𝖊𝖙𝖆 𝖆 𝖆𝖑𝖌𝖚𝖎𝖊𝖓 𝖕𝖆𝖗𝖆 𝖏𝖚𝖟𝖌𝖆𝖗𝖑𝖔.`);

    let kiraText = `🩸 *𝕰𝖑 𝖏𝖚𝖎𝖈𝖎𝖔 𝖍𝖆 𝖈𝖔𝖒𝖊𝖓𝖟𝖆𝖉𝖔* 🩸\n\n` +
                   `_¿Qué destino le espera a @${who.split('@')[0]}?_`;

    const buttons = [
        { "name": "quick_reply", "buttonParamsJson": `{"display_text":"💔 Ataque Cardiaco","id":"${prefix}dn @${who.split('@')[0]} Ataque al corazón"}` },
        { "name": "quick_reply", "buttonParamsJson": `{"display_text":"🚗 Accidente","id":"${prefix}dn @${who.split('@')[0]} Accidente de tráfico"}` },
        { "name": "quick_reply", "buttonParamsJson": `{"display_text":"🕊️ Perdonar","id":"${prefix}say Kira ha decidido tener piedad."}` }
    ];

    const msg = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: kiraText },
                    footer: { text: '𝖅0𝕽𝕿 𝕾𝖄𝕾𝕿𝕰𝕸𝕾' },
                    header: { title: '📓 𝕵𝖚𝖎𝖈𝖎𝖔 𝖉𝖊 𝕶𝖎𝖗𝖆', hasMediaAttachment: false },
                    nativeFlowMessage: { buttons }
                }
            }
        }
    };

    await conn.relayMessage(m.chat, msg.viewOnceMessage.message, { participant: { jid: m.chat } });
};

handler.command = ['kira', 'juzgar'];
handler.group = true;

export default handler;
