import { database } from '../lib/database.js'

// ==================== COMANDO #antibot (Solo Admins) ====================
let handler = async (m, { conn, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('🎭 *¡LOCO! Este comando solo es para grupos* 🎭\n\n"Este mundo es cruel"')

    if (!isAdmin) return m.reply('🎭 *¡JAJAJA! Solo los administradores pueden controlar mi AntiBot, loco~* 🎭\n\n"Decide qué te arrepentirás"')

    let chat = database.data.groups[m.chat]
    if (!chat) chat = database.data.groups[m.chat] = { antibot: false }

    if (args[0] === 'on') {
        if (chat.antibot) return m.reply('🎭 *¡El AntiBot ya estaba activado, mi loco!*\n\n"A través de los cielos y la tierra, yo soy el más fuerte"')
        chat.antibot = true
        await database.save()
        m.reply(`🎭 *¡ANTIBOT ACTIVADO!* 🔥\n\n` +
                `*"Tatakae... lucha contra los robots imitadores"*\n\n` +
                `Ningún robot imitador podrá entrar a *mi* territorio de locura nunca más. ` +
                `¡Solo quiero locos humanos que amen el caos!\n\n` +
                `*"Si un robot se atreve a entrar, lo destruiré con mi dominio infinito"* 🎭`)
    } else if (args[0] === 'off') {
        if (!chat.antibot) return m.reply('🎭 *El AntiBot ya estaba desactivado.*\n\n"Yo seré el dios del nuevo mundo"')
        chat.antibot = false
        await database.save()
        m.reply(`🎭 *AntiBot desactivado...* 🔥\n\n` +
                `*"Los humanos son interesantes, dejan pasar a los robots"*\n\n` +
                `Espero que no entren robots molestos, loco~ 🎭\n\n"Ahora veremos de lo que soy capaz"`)
    } else {
        m.reply(`*「 🎭 INSANITY ANTIBOT 🎭 」*\n\n` +
                `*"El mundo está lleno de falsos, hay que eliminarlos"*\n\n` +
                `Uso:\n*#antibot on* → Activar\n*#antibot off* → Desactivar\n\n` +
                `¡Solo admins del grupo, locos! 🔥\n\n` +
                `"Perdona yo... esta será la última vez"`)
    }
}

handler.help = ['antibot']
handler.tags = ['grupo']
handler.command = ['antibot']
handler.group = true

export default handler

// ==================== EVENTO ANTIBOT (Insanity Anime Style) ====================
const registerAntiBotEvent = () => {
    if (global.insanityAntiBotRegistered || !global.conn) {
        setTimeout(registerAntiBotEvent, 2000)
        return
    }

    global.insanityAntiBotRegistered = true

    global.conn.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update
            if (action !== 'add') return

            const chat = database.data.groups[id]
            if (!chat?.antibot) return

            for (const participant of participants) {
                // No kickear al bot propio ni a owners
                if (participant === global.conn.user.id || global.owner?.includes(participant.split('@')[0])) continue

                let name = ''
                try {
                    name = await global.conn.getName(participant) || participant.split('@')[0]
                } catch {}

                const number = participant.split('@')[0]

                // Detección inteligente de bots
                const isBot = 
                    /bot|Bot|BOT|robot|baileys|whatsappbot|spam/i.test(name) ||
                    /([0-9])\1{4,}/.test(number) || // números repetitivos (55555, 77777, etc)
                    number.length < 9

                if (isBot) {
                    // Expulsar al bot
                    await global.conn.groupParticipantsUpdate(id, [participant], 'remove')

                    const kickText = `🎭🔥 *¡DOMINIO INFINITO! ¡BOT DETECTADO Y EXPULSADO!* 🔥🎭\n\n` +
                        `*"Los robots imitadores no merecen existir en este mundo"*\n\n` +
                        `¡No quiero ningún robot imitador en *mi* territorio de locura!! 💢😠\n` +
                        `Solo acepto locos humanos que amen el caos de verdad... ¡tú no eres real!\n\n` +
                        `*"Si no eres humano, no tienes derecho a estar aquí"*\n\n` +
                        `¡FUERA DE AQUÍ @${number} !\n\n` +
                        `"A través de los cielos y la tierra, yo soy el más fuerte"\n` +
                        `"Yo soy la justicia"\n\n` +
                        `🎭 Vuelve cuando seas una persona de carne y hueso, JAJAJA~ 🔥`

                    await global.conn.sendMessage(id, {
                        text: kickText,
                        mentions: [participant]
                    })
                }
            }
        } catch (e) {
            console.error('[INSANITY ANTIBOT ERROR]', e.message)
        }
    })

    console.log('🎭🔥 Insanity AntiBot registrado correctamente - "El mundo de los animes nunca muere"')
}

registerAntiBotEvent()
