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

let handler = async (m, { conn, args, command }) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100, lastChamba: 0 }
        saveCoins()
    }

    await m.react('🍬')

    // #saldo
    if (command === 'saldo' || command === 'bal' || command === 'dinero') {
        return m.reply(`💗 *¡Tu saldo actual darling!* 🌸\n\n💰 *Monedas:* ${coins[userId].balance}`)
    }

    // #chamba (troll)
    if (command === 'chamba') {
        if (Date.now() - (coins[userId].lastChamba || 0) < 3600000) {
            return m.reply('💔 Ya chambeaste hoy darling\~ vuelve en 1 hora no me dejes sola\~')
        }
        const ganancia = 120
        coins[userId].balance += ganancia
        coins[userId].lastChamba = Date.now()
        saveCoins()

        return m.reply(`💗 *¡CHAMBA COMPLETADA DARLING!* 🌸\n\nLe chupas el pene a los creadores de la bot y ganas *${ganancia} monedas* 😂\n¡Zero Two aprueba este método troll! 💕\n\nSaldo actual: ${coins[userId].balance}`)
    }

    // #dar
    if (command === 'dar' || command === 'give') {
        const mentioned = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        const cantidad = parseInt(args[1] || args[0])
        if (!mentioned || isNaN(cantidad) || cantidad < 10) return m.reply('💔 Usa: *#dar @user 100*')
        if (coins[userId].balance < cantidad) return m.reply('💔 No tienes suficientes monedas mi amor\~')

        if (!coins[mentioned]) coins[mentioned] = { balance: 100 }
        coins[userId].balance -= cantidad
        coins[mentioned].balance += cantidad
        saveCoins()

        await conn.sendMessage(m.chat, { text: `💞 Le diste *\( {cantidad} monedas* a @ \){mentioned.split('@')[0]}`, mentions: [mentioned] }, { quoted: m })
        await m.react('💗')
    }

    // #robar
    if (command === 'robar' || command === 'rob') {
        const mentioned = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!mentioned) return m.reply('💔 Menciona a alguien darling\~')
        let victima = coins[mentioned] || { balance: 100 }
        if (victima.balance < 20) return m.reply('💔 No tiene monedas esa víctima\~')

        if (Math.random() < 0.6) {
            const robado = Math.floor(victima.balance * 0.3) + 10
            coins[userId].balance += robado
            victima.balance -= robado
            saveCoins()
            await conn.sendMessage(m.chat, { text: `💰 ¡Le robaste *\( {robado} monedas* a @ \){mentioned.split('@')[0]}!`, mentions: [mentioned] }, { quoted: m })
        } else {
            coins[userId].balance = Math.max(0, coins[userId].balance - 30)
            saveCoins()
            m.reply('💔 ¡Te atraparon! Perdiste 30 monedas 😂')
        }
    }

    // #top
    if (command === 'top') {
        const top = Object.entries(coins).sort((a,b) => b[1].balance - a[1].balance).slice(0,10)
        let txt = `✨ *TOP 10 MÁS RICOS* ✨\n\n`
        top.forEach(([id,data],i) => txt += `\( {i+1}° @ \){id.split('@')[0]} → *${data.balance} monedas*\n`)
        await conn.sendMessage(m.chat, { text: txt, mentions: top.map(t=>t[0]) }, { quoted: m })
    }
}

handler.help = ['saldo', 'chamba', 'dar @user <cantidad>', 'robar @user', 'top']
handler.tags = ['economy']
handler.command = ['saldo','bal','dinero','chamba','dar','give','robar','rob','top']
handler.group = true

export default handler