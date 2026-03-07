import fs from 'fs'
import path from 'path'

const dataDir = './database'
const dataFile = path.join(dataDir, 'coins.json')

let coins = {}
try {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf8').trim()
        if (data) coins = JSON.parse(data)
    }
} catch (e) {}

const saveCoins = () => {
    fs.writeFileSync(dataFile, JSON.stringify(coins, null, 2))
}

let handler = async (m, { conn, args, command, isAdmin }) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100 }
        saveCoins()
    }

    await m.react('🍬')

    // ====================== SALDO ======================
    if (command === 'saldo' || command === 'bal' || command === 'dinero') {
        const saldo = coins[userId].balance
        return m.reply(`💗 *¡Tu saldo actual darling!* 🌸\n\n` +
                       `💰 *Monedas:* ${saldo}\n\n` +
                       `Usa *#trabajar*, *#dar*, *#robar* o *#top* 💕`)
    }

    // ====================== DAR MONEDAS ======================
    if (command === 'dar' || command === 'give') {
        const mentioned = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        const cantidad = parseInt(args[1] || args[0])
        
        if (!mentioned || isNaN(cantidad) || cantidad < 10) {
            return m.reply('💔 Usa: *#dar @user 100* darling\~')
        }
        if (coins[userId].balance < cantidad) {
            return m.reply('💔 No tienes suficientes monedas mi amor\~')
        }

        if (!coins[mentioned]) coins[mentioned] = { balance: 100 }
        coins[userId].balance -= cantidad
        coins[mentioned].balance += cantidad
        saveCoins()

        await conn.sendMessage(m.chat, {
            text: `💞 *¡Transferencia completada darling!* 💗\n\n` +
                  `Le diste *\( {cantidad} monedas* a @ \){mentioned.split('@')[0]}`,
            mentions: [mentioned]
        }, { quoted: m })
        await m.react('💗')
        return
    }

    // ====================== TRABAJAR ======================
    if (command === 'trabajar' || command === 'work') {
        const lastWork = coins[userId].lastWork || 0
        if (Date.now() - lastWork < 3600000) { // 1 hora cooldown
            return m.reply('💔 Ya trabajaste hoy darling\~ vuelve en 1 hora\~')
        }

        const ganancia = Math.floor(Math.random() * 150) + 50
        coins[userId].balance += ganancia
        coins[userId].lastWork = Date.now()
        saveCoins()

        return m.reply(`🌸 *¡Trabajaste duro darling!* 💗\n\n` +
                       `Ganaste *${ganancia} monedas* trabajando para Zero Two\~ 💕\n` +
                       `Saldo actual: ${coins[userId].balance}`)
    }

    // ====================== ROBAR ======================
    if (command === 'robar' || command === 'rob') {
        const mentioned = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!mentioned || mentioned === userId) {
            return m.reply('💔 Menciona a alguien para robarle darling\~')
        }

        const victima = coins[mentioned] || { balance: 100 }
        if (victima.balance < 20) return m.reply('💔 Esa persona no tiene monedas suficientes\~')

        const chance = Math.random()
        if (chance < 0.6) { // 60% éxito
            const robado = Math.floor(victima.balance * 0.3) + 10
            coins[userId].balance += robado
            victima.balance -= robado
            saveCoins()

            await conn.sendMessage(m.chat, {
                text: `💰 *¡ROBO EXITOSO DARLING!* 💗\n\nLe robaste *\( {robado} monedas* a @ \){mentioned.split('@')[0]}`,
                mentions: [mentioned]
            }, { quoted: m })
        } else {
            const multa = Math.floor(coins[userId].balance * 0.2) || 20
            coins[userId].balance -= multa
            saveCoins()
            m.reply(`💔 *¡Te atraparon robando!* Perdiste *${multa} monedas*...`)
        }
        await m.react('💗')
        return
    }

    // ====================== TOP ======================
    if (command === 'top') {
        const top = Object.entries(coins)
            .sort((a, b) => b[1].balance - a[1].balance)
            .slice(0, 10)

        let texto = `✨ *TOP 10 MÁS RICOS DEL GRUPO* ✨\n\n`
        top.forEach(( [id, data], i) => {
            texto += `\( {i+1}° @ \){id.split('@')[0]} → *${data.balance} monedas*\n`
        })

        await conn.sendMessage(m.chat, { text: texto, mentions: top.map(t => t[0]) }, { quoted: m })
        await m.react('💗')
    }
}

handler.help = ['saldo', 'dar @user <cantidad>', 'trabajar', 'robar @user', 'top']
handler.tags = ['economy']
handler.command = ['saldo', 'bal', 'dinero', 'dar', 'give', 'trabajar', 'work', 'robar', 'rob', 'top']
handler.group = true

export default handler