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

let handler = async (m, { command }) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100, lastChamba: 0 }
        saveCoins()
    }

    const moneda = global.moneda || 'monedas'   // ← Usa la global del settings

    await m.react('🍬')

    // #saldo
    if (command === 'saldo' || command === 'bal' || command === 'dinero') {
        return m.reply(`💗 *¡Tu saldo actual darling!* 🌸\n\n💰 *${moneda}:* ${coins[userId].balance}`)
    }

    // #chamba troll
    if (command === 'chamba') {
        if (Date.now() - (coins[userId].lastChamba || 0) < 3600000) {
            return m.reply('💔 Ya chambeaste hoy darling\~ vuelve en 1 hora no me dejes sola\~')
        }

        const ganancia = 120
        coins[userId].balance += ganancia
        coins[userId].lastChamba = Date.now()
        saveCoins()

        return m.reply(`💗 *¡CHAMBA COMPLETADA DARLING!* 🌸\n\nLe chupas el pene a los creadores de la bot y ganas *${ganancia} ${moneda}* 😂\n¡Zero Two aprueba este método troll! 💕\n\nSaldo actual: ${coins[userId].balance} ${moneda}`)
    }
}

handler.help = ['saldo', 'chamba']
handler.tags = ['economy']
handler.command = ['saldo', 'bal', 'dinero', 'chamba']
handler.group = true

export default handler