import chalk from 'chalk'

if (!Array.isArray(global.conns)) global.conns = []

function msToUptime(ms) {
const seconds = Math.floor((ms / 1000) % 60)
const minutes = Math.floor((ms / (1000 * 60)) % 60)
const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
const days = Math.floor(ms / (1000 * 60 * 60 * 24))
if (days > 0) return `${days}d ${hours}h ${minutes}m`
if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
if (minutes > 0) return `${minutes}m ${seconds}s`
return `${seconds}s`
}

function getPhone(jid) {
if (!jid) return '???'
return jid.split('@')[0].split(':')[0]
}

function getBotName(c) {
return ( c?.user?.name || c?.user?.verifiedName || c?.pushName || c?.name || null )
}

function getBotJid(c) {
return ( c?.user?.jid || c?.user?.id || c?.authState?.creds?.me?.id || null )
}

function isConnected(c) {
return ( c?.ws?.readyState === 1 || c?.user != null )
}

const handler = async (m, { conn, isOwner }) => {
if (!isOwner) {
return conn.sendMessage(m.chat, { text: `👑 *ACCESO RESTRINGIDO*\nEste comando solo puede ser ejecutado por mi creador.` }, { quoted: m })
}

const allConns = global.conns || []

const mainName = conn.user?.name || botName
const mainUptime = process.uptime ? msToUptime(process.uptime() * 1000) : ':v'

//Usare mis diseños, ya ahi tu lo editas.
let msg = `• ✦【 *Lista de Bots* 】✦ •

> *Bot Principal*
𝇈 *Nombre* » ${mainName}
𝇈 *Uptime* » ${mainUptime}\n\n`
if (allConns.length === 0) {
msg += `\n> *Sub-bots*\n📍 No hay sub-bots conectados.`
} else {
msg += `\n> *Sub-bots* (${allConns.length} total)\n`

allConns.forEach((c, i) => {
const name = getBotName(c) || `Bot ${i + 1}`
const online = isConnected(c)
const status = online ? 'Conectado' : 'Desconectado' //Depende si funciona
const uptime = c?.startTime ? msToUptime(Date.now() - c.startTime) : ':v'
msg += `\n𝇈 *${i + 1}.* ${name}\n` +
`• *Estado* » ${status}\n` +
`• *Uptime* » ${uptime || '---'}\n\n`
})
}

await conn.sendMessage(m.chat, { text: msg }, { quoted: m }) //Usa conn.sendMessage que es mas seguro.
}

handler.command = ['bots', 'subbots', 'listbots']
handler.tags = ['serbot']
handler.help = ['bots']
export default handler