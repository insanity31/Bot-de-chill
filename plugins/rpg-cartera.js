let handler = async (m, { conn, who, db }) => {
    // Si no hay monedas, poner 0 por defecto
    if (typeof db.users[who].coin === 'undefined') db.users[who].coin = 0
    
    let name = db.users[who].name || m.pushName
    let coins = db.users[who].coin
    let exp = db.users[who].exp || 0
    let limit = db.users[who].limit || 0

    let text = `👛 *CARTERA DE USUARIO*\n\n` +
               `👤 *Nombre:* ${name}\n` +
               `💰 *Coins:* ${coins}\n` +
               `✨ *Exp:* ${exp}\n` +
               `💎 *Límite:* ${limit}`

    await conn.sendMessage(m.chat, { text, mentions: [who] }, { quoted: m })
}

handler.help = ['cartera', 'coins']
handler.tags = ['rpg']
handler.command = ['cartera', 'coins', 'bal', 'wallet']

export default handler
