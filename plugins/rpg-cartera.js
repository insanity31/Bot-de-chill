let handler = async (m, { conn, who, db }) => {
    // 1. INICIACIÓN FORZADA
    if (!db.users) db.users = {}
    if (!db.users[who]) {
        db.users[who] = {
            coin: 0,
            exp: 0,
            limit: 20,
            name: m.pushName || 'Usuario'
        }
    }

    // 2. Aseguramos valores numéricos
    let coins = db.users[who].coin !== undefined ? db.users[who].coin : 0
    let exp = db.users[who].exp !== undefined ? db.users[who].exp : 0
    let limit = db.users[who].limit !== undefined ? db.users[who].limit : 0
    let name = db.users[who].name || 'Sin nombre'

    let text = `👛 *CARTERA DE USUARIO*\n\n` +
               `👤 *Nombre:* ${name}\n` +
               `💰 *Coins:* ${coins}\n` +
               `✨ *Exp:* ${exp}\n` +
               `💎 *Límite:* ${limit}`

    await conn.sendMessage(m.chat, { text, mentions: [who] }, { quoted: m })
}

handler.command = ['cartera', 'coins', 'bal']
export default handler
