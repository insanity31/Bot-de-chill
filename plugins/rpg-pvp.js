let handler = async (m, { conn, text, command, usedPrefix }) => {
    // Inicializamos el objeto global para guardar las partidas si no existe
    conn.pvp = conn.pvp ? conn.pvp : {}

    let opponent = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : false)
    
    if (!opponent) return m.reply(`⚠️ Debes mencionar o responder al mensaje del usuario al que quieres desafiar.\nEjemplo: ${usedPrefix + command} @usuario`)
    if (opponent === m.sender) return m.reply('❌ No puedes luchar contra ti mismo.')
    if (conn.pvp[m.chat] && conn.pvp[m.chat][m.sender]) return m.reply('⚠️ Ya tienes un combate pendiente en este grupo.')

    conn.pvp[m.chat] = conn.pvp[m.chat] || {}
    let gameId = m.sender + '-' + opponent

    // Configuramos los botones (Nota: Dependiendo de la versión de tu Baileys/WhatsApp, los botones pueden no mostrarse, por eso damos la opción de escribir)
    let buttonMessage = {
        text: `⚔️ *Zero Two ha preparado la arena de combate* ⚔️\n\n@${m.sender.split('@')[0]} ha desafiado a @${opponent.split('@')[0]} a Piedra, Papel o Tijera.\n\nPara iniciar, el oponente debe presionar el botón de *Aceptar* o responder a este mensaje con la palabra *Aceptar*.\n\n⏳ Tienen 30 segundos.`,
        mentions: [m.sender, opponent],
        buttons: [
            { buttonId: 'aceptar_pvp', buttonText: { displayText: 'Aceptar' }, type: 1 },
            { buttonId: 'rechazar_pvp', buttonText: { displayText: 'Rechazar' }, type: 1 }
        ],
        headerType: 1
    }

    // Guardamos el estado del juego y el temporizador
    conn.pvp[m.chat][gameId] = {
        p1: m.sender,
        p2: opponent,
        state: 'ESPERANDO_ACEPTACION',
        p1Choice: null,
        p2Choice: null,
        timeout: setTimeout(() => {
            if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                delete conn.pvp[m.chat][gameId]
                conn.sendMessage(m.chat, { text: '⏳ Tardaste mucho, batalla terminada.' })
            }
        }, 30000) // 30 segundos
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
}

// Este bloque escucha las respuestas automáticamente sin necesidad de usar un prefijo
handler.before = async function (m, { conn }) {
    conn.pvp = conn.pvp ? conn.pvp : {}
    if (!conn.pvp[m.chat]) return

    // Buscamos si el usuario que escribe está en una partida activa en este grupo
    let gameId = Object.keys(conn.pvp[m.chat]).find(id => {
        let g = conn.pvp[m.chat][id]
        return (g.p1 === m.sender || g.p2 === m.sender)
    })

    if (!gameId) return
    let game = conn.pvp[m.chat][gameId]

    let textoCorto = m.text.toLowerCase().trim()

    // --- FASE 1: ACEPTAR EL COMBATE ---
    if (game.state === 'ESPERANDO_ACEPTACION' && m.sender === game.p2) {
        if (textoCorto === 'aceptar' || m.buttonResponse?.buttonId === 'aceptar_pvp') {
            clearTimeout(game.timeout) // Frenamos el reloj de 30s
            game.state = 'ESPERANDO_ELECCION'
            
            // Iniciamos un nuevo reloj de 30s para que elijan su jugada
            game.timeout = setTimeout(() => {
                if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                    delete conn.pvp[m.chat][gameId]
                    conn.sendMessage(m.chat, { text: '⏳ Alguien tardó mucho en elegir, batalla terminada.' })
                }
            }, 30000)

            let msg = `✅ ¡El combate ha sido aceptado!\n\n@${game.p1.split('@')[0]} y @${game.p2.split('@')[0]},\nEscriban aquí en el grupo su elección: *Piedra*, *Papel* o *Tijera*.\n\n⏳ Tienen 30 segundos.`
            return conn.sendMessage(m.chat, { text: msg, mentions: [game.p1, game.p2] })
            
        } else if (textoCorto === 'rechazar' || m.buttonResponse?.buttonId === 'rechazar_pvp') {
            clearTimeout(game.timeout)
            delete conn.pvp[m.chat][gameId]
            return m.reply('❌ El desafío ha sido rechazado.')
        }
    }

    // --- FASE 2: ELEGIR JUGADA ---
    if (game.state === 'ESPERANDO_ELECCION' && (m.sender === game.p1 || m.sender === game.p2)) {
        let opcionesValidas = ['piedra', 'papel', 'tijera']

        if (opcionesValidas.includes(textoCorto)) {
            // Guardamos la elección de quien escribió
            if (m.sender === game.p1 && !game.p1Choice) game.p1Choice = textoCorto
            if (m.sender === game.p2 && !game.p2Choice) game.p2Choice = textoCorto

            // Opcional: Intentar borrar el mensaje para que el otro no copie la jugada (requiere que el bot sea admin)
            try { await conn.sendMessage(m.chat, { delete: m.key }) } catch (e) {}

            // Si ambos ya eligieron, definimos al ganador
            if (game.p1Choice && game.p2Choice) {
                clearTimeout(game.timeout)
                
                let resultado = ''
                if (game.p1Choice === game.p2Choice) {
                    resultado = '🤝 *¡Es un empate!*'
                } else if (
                    (game.p1Choice === 'piedra' && game.p2Choice === 'tijera') ||
                    (game.p1Choice === 'papel' && game.p2Choice === 'piedra') ||
                    (game.p1Choice === 'tijera' && game.p2Choice === 'papel')
                ) {
                    resultado = `🎉 *¡Ganador:* @${game.p1.split('@')[0]} *!*`
                } else {
                    resultado = `🎉 *¡Ganador:* @${game.p2.split('@')[0]} *!*`
                }

                let msgFinal = `⚔️ *RESULTADO DEL PVP* ⚔️\n\n` +
                               `@${game.p1.split('@')[0]} eligió: ${game.p1Choice}\n` +
                               `@${game.p2.split('@')[0]} eligió: ${game.p2Choice}\n\n` +
                               `${resultado}`

                await conn.sendMessage(m.chat, { text: msgFinal, mentions: [game.p1, game.p2] })
                delete conn.pvp[m.chat][gameId] // Terminamos el juego
            }
        }
    }
}

handler.help = ['pvp @usuario']
handler.tags = ['fun', 'rpg']
handler.command = /^(pvp)$/i

export default handler
