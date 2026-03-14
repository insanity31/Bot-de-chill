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
        coins[userId] = { balance: 100, lastWeekly: 0 }
        saveCoins()
    }

    const moneda = global.moneda || 'monedas'

    await m.react('🍬')

    const cd = 7 * 24 * 60 * 60 * 1000  // 7 días
    if (Date.now() - (coins[userId].lastWeekly || 0) < cd) {
        const tiempo = Math.ceil((cd - (Date.now() - coins[userId].lastWeekly)) / 86400000)
        return m.reply(`💔 Ya reclamaste tu weekly darling\~\nVuelve en *${tiempo} días* no me dejes sola\~`)
    }

    const ganancia = Math.floor(Math.random() * 1500) + 800  // 800-2300 monedas
    coins[userId].balance += ganancia
    coins[userId].lastWeekly = Date.now()
    saveCoins()

    const texto = `💗 *¡WEEKLY RECLAMADO DARLING!* 🌸\n\n` +
                  `¡Zero Two te trajo una recompensa especial por ser tan fiel toda la semana! 💕\n` +
                  `Ganaste *${ganancia} ${moneda}* 🎉\n\n` +
                  `Saldo actual: ${coins[userId].balance} ${moneda}`

    return m.reply(texto)
}

handler.help = ['weekly']
handler.tags = ['economy']
handler.command = ['weekly']
handler.group = true

export default handler