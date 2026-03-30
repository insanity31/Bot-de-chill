const handler = async (m, { conn, args }) => {
    await m.react('📊')

    const mem = process.memoryUsage()
    const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2)

    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    const text =
        `${global.vs}\n\n` +
        `📊 *ESTADÍSTICAS DEL BOT*\n\n` +
        `🧠 *RAM*\n` +
        `├ RSS: ${toMB(mem.rss)} MB\n` +
        `├ Heap usado: ${toMB(mem.heapUsed)} MB\n` +
        `├ Heap total: ${toMB(mem.heapTotal)} MB\n` +
        `└ Externo: ${toMB(mem.external)} MB\n\n` +
        `⏱️ *UPTIME*\n` +
        `└ ${hours}h ${minutes}m ${seconds}s\n\n` +
        `⚙️ *PROCESO*\n` +
        `├ Node: ${process.version}\n` +
        `├ Plataforma: ${process.platform}\n` +
        `└ PID: ${process.pid}`

    await m.reply(text)
    await m.react('✅')
}

handler.help = ['stats']
handler.tags = ['owner']
handler.command = [ 'stats', 'ram']
handler.owner = true

export default handler