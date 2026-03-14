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
        coins[userId] = { balance: 100, lastMisiones: 0 }
        saveCoins()
    }

    const moneda = global.moneda || 'monedas'

    await m.react('🍬')

    const cd = 24 * 60 * 60 * 1000  // 24 horas
    if (Date.now() - (coins[userId].lastMisiones || 0) < cd) {
        const tiempo = Math.ceil((cd - (Date.now() - coins[userId].lastMisiones)) / 3600000)
        return m.reply(`💔 Ya completaste tus misiones diarias darling\~\nVuelve en *${tiempo} horas* no me dejes sola\~`)
    }

    const misiones = [
        { desc: 'Ayuda a Zero Two a recolectar 5 caramelos', reward: 250 },
        { desc: 'Sobrevive a un abrazo de Zero Two (sin morir de amor)', reward: 300 },
        { desc: 'Convence a un slime de que eres su amigo', reward: 400 },
        { desc: 'Escapa de una waifu celosa en 3 segundos', reward: 500 }
    ]

    const elegida = misiones[Math.floor(Math.random() * misiones.length)]
    const ganancia = elegida.reward + Math.floor(Math.random() * 100)

    coins[userId].balance += ganancia
    coins[userId].lastMisiones = Date.now()
    saveCoins()

    const texto = `💗 *¡MISION DIARIA COMPLETADA DARLING!* 🌸\n\n` +
                  `Misión: ${elegida.desc}\n` +
                  `Recompensa: *${ganancia} ${moneda}* 🎉\n\n` +
                  `¡Zero Two está orgullosa de ti! 💕\n` +
                  `Saldo actual: ${coins[userId].balance} ${moneda}`

    return m.reply(texto)
}

handler.help = ['misiones', 'dailyquests']
handler.tags = ['rpg', 'economy']
handler.command = ['misiones', 'dailyquests', 'quest']
handler.group = true

export default handler