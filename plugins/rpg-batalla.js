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

const enemigos = [
    "Slime Rey pervertido", "Goblin caliente", "Dragón waifu celosa",
    "Esqueleto con fetiche", "Demonio incubo", "Clon malvado de Zero Two"
]

let handler = async (m, { command }) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100, lastBatalla: 0 }
        saveCoins()
    }

    const moneda = global.moneda || 'monedas'

    await m.react('🍬')

    // Cooldown 15 minutos
    if (Date.now() - (coins[userId].lastBatalla || 0) < 900000) {
        const tiempo = Math.ceil((900000 - (Date.now() - coins[userId].lastBatalla)) / 60000)
        return m.reply(`💔 Ya peleaste hoy darling\~\nVuelve en *${tiempo} minutos* no me dejes sola\~`)
    }

    const enemigo = enemigos[Math.floor(Math.random() * enemigos.length)]
    const resultado = Math.random()

    let ganancia = 0
    let texto = ''

    if (resultado < 0.45) { // 45% ganas
        ganancia = Math.floor(Math.random() * 250) + 150
        coins[userId].balance += ganancia
        texto = `💗 *¡GANASTE LA BATALLA DARLING!* 🌸\n\n` +
                `Derrotaste al ${enemigo} usando tu técnica secreta "Chupada Ultra"...\n` +
                `¡Te dio *${ganancia} ${moneda}* como recompensa! 😂`
    } 
    else if (resultado < 0.75) { // 30% empate
        ganancia = Math.floor(Math.random() * 80) + 40
        coins[userId].balance += ganancia
        texto = `🌸 *¡EMPATE!* El \( {enemigo} te dio un beso y te dejó * \){ganancia} ${moneda}* por lástima\~`
    } 
    else { // 25% pierdes
        ganancia = Math.floor(Math.random() * 120) + 50
        coins[userId].balance = Math.max(0, coins[userId].balance - ganancia)
        texto = `💔 *¡PERDISTE LA BATALLA!* El \( {enemigo} te dejó sin ropa y te robó * \){ganancia} ${moneda}*... ay nooo\~ 😭`
    }

    coins[userId].lastBatalla = Date.now()
    saveCoins()

    return m.reply(texto + `\n\n💰 Saldo actual: ${coins[userId].balance} ${moneda}`)
}

handler.help = ['batalla', 'rpgbatalla']
handler.tags = ['rpg', 'economy']
handler.command = ['batalla', 'rpgbatalla', 'battle']
handler.group = true

export default handler