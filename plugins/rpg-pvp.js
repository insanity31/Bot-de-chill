let handler = async (m, { conn, prefix, who, db }) => {
    conn.pvp = conn.pvp ? conn.pvp : {}
    
    // 1. Verificación de objetivo
    if (!who || who === m.sender) {
        return m.reply(`*⚔️ ¡DESAFÍO PVP! ⚔️*\n\nDebes etiquetar a alguien o responder a su mensaje.\nEjemplo: *${prefix}pvp @user*`)
    }

    // 2. INICIACIÓN FORZADA (Evita el error de 'undefined')
    if (!db.users) db.users = {}
    if (!db.users[m.sender]) db.users[m.sender] = { coin: 0, exp: 0, limit: 20 }
    if (!db.users[who]) db.users[who] = { coin: 0, exp: 0, limit: 20 }

    // Aseguramos que la propiedad coin exista (por si el usuario ya existía pero no tenía monedas)
    if (db.users[m.sender].coin === undefined) db.users[m.sender].coin = 0
    if (db.users[who].coin === undefined) db.users[who].coin = 0

    let apuesta = 200

    // 3. Verificación de saldo
    if (db.users[m.sender].coin < apuesta) {
        return m.reply(`❌ No tienes suficientes monedas. Necesitas ${apuesta} y tienes ${db.users[m.sender].coin}.`)
    }
    if (db.users[who].coin < apuesta) {
        return m.reply(`❌ El oponente (@${who.split('@')[0]}) no tiene suficientes monedas para apostar.`, null, { mentions: [who] })
    }

    if (conn.pvp[m.chat] && Object.values(conn.pvp[m.chat]).some(g => g.p1 === m.sender || g.p2 === m.sender)) {
        return m.reply('⚠️ Ya tienes un duelo pendiente en este grupo.')
    }

    let gameId = m.sender + '-' + who
    conn.pvp[m.chat] = conn.pvp[m.chat] || {}

    conn.pvp[m.chat][gameId] = {
        p1: m.sender,
        p2: who,
        state: 'ESPERANDO_ACEPTACION',
        p1Choice: null,
        p2Choice: null,
        bet: apuesta,
        timeout: setTimeout(() => {
            if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                delete conn.pvp[m.chat][gameId]
                conn.sendMessage(m.chat, { text: '⏳ PVP cancelado: Se acabó el tiempo de respuesta.' })
            }
        }, 30000)
    }

    await conn.sendMessage(m.chat, { 
        text: `⚔️ *DUELO SOLICITADO* ⚔️\n\n@${m.sender.split('@')[0]} reta a @${who.split('@')[0]}\n💰 Apuesta: *${apuesta} Coins*\n\nEscribe *Aceptar* para pelear o *Rechazar*.`,
        mentions: [m.sender, who]
    }, { quoted: m })
}

// Lógica de respuesta (Before)
handler.before = async function (m, { conn }) {
    conn.pvp = conn.pvp ? conn.pvp : {}
    if (!conn.pvp[m.chat]) return

    let gameId = Object.keys(conn.pvp[m.chat]).find(id => id.includes(m.sender))
    if (!gameId) return
    
    let game = conn.pvp[m.chat][gameId]
    let input = m.text.toLowerCase().trim()
    let database = global.database

    if (game.state === 'ESPERANDO_ACEPTACION' && m.sender === game.p2) {
        if (input === 'aceptar') {
            clearTimeout(game.timeout)
            game.state = 'ESPERANDO_ELECCION'
            game.timeout = setTimeout(() => {
                if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                    delete conn.pvp[m.chat][gameId]
                    conn.sendMessage(m.chat, { text: '⏳ Tiempo agotado para elegir jugada.' })
                }
            }, 30000)
            return m.reply('✅ Reto aceptado. ¡Escriban: *Piedra*, *Papel* o *Tijera*!\n(Mensajes ocultos)')
        } else if (input === 'rechazar') {
            clearTimeout(game.timeout)
            delete conn.pvp[m.chat][gameId]
            return m.reply('❌ Duelo rechazado.')
        }
    }

    if (game.state === 'ESPERANDO_ELECCION' && (m.sender === game.p1 || m.sender === game.p2)) {
        let choices = ['piedra', 'papel', 'tijera']
        if (choices.includes(input)) {
            if (m.sender === game.p1 && !game.p1Choice) game.p1Choice = input
            if (m.sender === game.p2 && !game.p2Choice) game.p2Choice = input
            try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

            if (game.p1Choice && game.p2Choice) {
                clearTimeout(game.timeout)
                let win = '', p1 = game.p1, p2 = game.p2, c1 = game.p1Choice, c2 = game.p2Choice
                let userDb = global.database.data.users

                if (c1 === c2) win = 'empate'
                else if ((c1 === 'piedra' && c2 === 'tijera') || (c1 === 'papel' && c2 === 'piedra') || (c1 === 'tijera' && c2 === 'papel')) win = p1
                else win = p2

                let res = `⚔️ *RESULTADOS* ⚔️\n\n@${p1.split('@')[0]}: ${c1}\n@${p2.split('@')[0]}: ${c2}\n\n`
                if (win === 'empate') res += '🤝 ¡Empate! Nadie pierde nada.'
                else {
                    let loser = (win === p1) ? p2 : p1
                    userDb[win].coin += game.bet
                    userDb[loser].coin -= game.bet
                    await database.save()
                    res += `🎉 Ganador: @${win.split('@')[0]}\n💰 Ganaste: ${game.bet} Coins`
                }
                await conn.sendMessage(m.chat, { text: res, mentions: [p1, p2] })
                delete conn.pvp[m.chat][gameId]
            }
        }
    }
}

handler.command = ['pvp']
handler.group = true
export default handler
