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
  if (!jid) return null
  return jid.split('@')[0].split(':')[0]
}

const handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('👑 *ACCESO RESTRINGIDO*\nEste comando solo puede ser ejecutado por mi creador.')

  const active = global.conns.filter(c => c?.user?.jid)

  if (active.length === 0) {
    return m.reply(`${global.vs}\n\n  ◇ No hay SubBots conectados actualmente.`)
  }

  const now = Date.now()
  let lista = `${global.vs}\n\n  ◆ SubBots conectados › ${active.length}\n\n`

  active.forEach((sock, i) => {
    const nombre = sock.user?.name || sock.user?.verifiedName || 'Desconocido'
    const phone = getPhone(sock.user?.jid)
    const uptime = sock.startTime ? msToUptime(now - sock.startTime) : 'Desconocido'
    const link = phone ? `https://wa.me/${phone}` : 'N/A'

    lista += `  ${i + 1}. ${nombre}\n`
    lista += `     ✧ Número  › ${link}\n`
    lista += `     ✧ Activo  › ${uptime}\n`
    if (i < active.length - 1) lista += `\n`
  })

  return m.reply(lista)
}

handler.command = ['bots', 'subbots', 'listbots']
handler.tags = ['serbot']
handler.help = ['bots']

export default handler