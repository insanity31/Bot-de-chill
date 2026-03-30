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

  const debug =
    `conns length: ${global.conns?.length}\n` +
    `type: ${typeof global.conns}\n` +
    `jids: ${JSON.stringify(global.conns?.map(c => c?.user?.jid))}`

  return m.reply(debug)
}

handler.command = ['bots', 'subbots', 'listbots']
handler.tags = ['serbot']
handler.help = ['bots']

export default handler