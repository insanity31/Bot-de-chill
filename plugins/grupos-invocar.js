const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    await m.react('🗣️')

    try {
        const group = await conn.groupMetadata(m.chat)
        const participants = group.participants.map(p => p.jid || p.id.split(':')[0] + '@s.whatsapp.net')

        const anuncio = args.join(' ') || '¡levantense 🗣️‼️🔥! '

        const mentions = participants.map(p => `@${p.split('@')[0]}`).join(' ')

        const caption =
            `🔥 *¡ INVOCANDO A TODO EL GRUPO!* 🔥\n\n` +
            `🔥 *Anuncio:* ${anuncio}\n\n` +
            `${mentions}\n\n` +
            `${mentions}\n\n` +
            `¡Respondan rapido putas~ `

        await conn.sendMessage(m.chat, {
            image: { url: 'https://causas-files.vercel.app/fl/tlo3.jpg' },
            caption: caption,
            mentions: participants
        }, { quoted: m }) 

        await m.react('🗿')

    } catch (e) {
        console.error('❌ INVOCAR ERROR:', e)
        await m.react('🗣️')
        m.reply('😐 Uy bro... la invocación falló esta vez crack\nInténtalo de nuevo para ver')
    }
}

handler.help = ['invocar', 'invocar <texto>']
handler.tags = ['group']
handler.command = ['invocar', 'invocarwaifu']
handler.group = true
handler.admin = true

export default handler
