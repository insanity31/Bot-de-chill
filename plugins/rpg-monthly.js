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

const saveCoins = () => fs.writeFileSync(dataFile, JSON.stringify(coins, null, 2))

let handler = async (m) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100, lastMonthly: 0 }
        saveCoins()
    }

    const moneda = global.moneda || 'monedas'

    await m.react('🍬')

    const cd = 30 * 24 * 60 * 60 * 1000  // 30 días
    if (Date.now() - (coins[userId].lastMonthly || 0) < cd) {
        const diasRest = Math.ceil((cd - (Date.now() - coins[userId].lastMonthly)) / 86400000)
        return m.reply(`💔 Ya reclamaste tu monthly darling\~\nVuelve en *${diasRest} días* no me dejes sola\~`)
    }

    const ganancia = Math.floor(Math.random() * 5000) + 3000  // 3000-8000 monedas
    coins[userId].balance += ganancia
    coins[userId].lastMonthly = Date.now()
    saveCoins()

    const texto = `💗 *¡MONTHLY RECLAMADO DARLING!* 🌸\n\n` +
                  `¡Zero Two te trajo una recompensa épica por ser tan fiel todo el mes! 💕\n` +
                  `Ganaste *${ganancia} ${moneda}* 🎉\n\n` +
                  `Saldo actual: ${coins[userId].balance} ${moneda}`

    return m.reply(texto)
}

handler.help = ['monthly']
handler.tags = ['economy']
handler.command = ['monthly']
handler.group = true

export default handler