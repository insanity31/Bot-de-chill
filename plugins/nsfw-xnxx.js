import fetch from 'node-fetch'
import cheerio from 'cheerio'

let handler = async (m, { args, usedPrefix, command }) => {
    if (!global.db.data.chats[m.chat].nsfw) {
        await m.react('💔')
        return m.reply(`ꕥ El contenido *NSFW* está desactivado en este grupo.\n\nUn *administrador* puede activarlo con:\n» *${usedPrefix}nable nsfw on*`)
    }

    await m.react('🍬')

    const query = args.join(" ").trim()
    if (!query) {
        await m.react('🌸')
        return m.reply(`💗 Ingresa el título o URL del video de XNXX darling\~\nEjemplo:\n*#xnxx mia khalifa* o *#xnxx https://xnxx.com/...*`)
    }

    try {
        const isUrl = query.includes("xnxx.com")
        if (isUrl) {
            const res = await xnxxdl(query)
            if (!res.result?.files?.high && !res.result?.files?.low) throw new Error('No se encontró video')

            const dll = res.result.files.high || res.result.files.low
            const thumb = await fetch(res.result.image).then(r => r.buffer())
            const video = await fetch(dll).then(r => r.buffer())

            let caption = `💗 *XNXX - DESCARGA EXITOSA!* 🌸\n\n` +
                          `Título: ${res.result.title}\n` +
                          `Duración: ${res.result.info.dur || 'Desconocida'}\n` +
                          `Calidad: ${res.result.info.qual || 'Desconocida'}\n` +
                          `Vistas: ${res.result.info.views || 'Desconocidas'}\n\n` +
                          `¡Disfrútalo mi amor\~ no me dejes sola! 💕`

            await conn.sendMessage(m.chat, {
                video: video,
                caption: caption,
                mimetype: 'video/mp4'
            }, { quoted: m })

            await m.react('💗')
            return
        }

        // Búsqueda
        const res = await search(encodeURIComponent(query))
        if (!res.result?.length) {
            await m.react('💔')
            return m.reply('💔 No se encontraron resultados darling\~')
        }

        const list = res.result.slice(0, 10).map((v, i) => `${i+1}. ${v.title}\n   ${v.link}`).join('\n\n')
        const caption = `💗 *XNXX - BÚSQUEDA!* 🌸\n\n${list}\n\n` +
                        `Copia y pega la URL de uno de los videos para descargarlo con *#xnxx <url>*`

        await m.reply(caption)
        await m.react('💗')

    } catch (e) {
        console.error('XNXX ERROR:', e.message || e)
        await m.react('💔')
        m.reply(`💔 Uy darling... algo salió mal\~\nError: ${e.message || 'Desconocido'}`)
    }
}

async function xnxxdl(URL) {
    const res = await fetch(URL)
    const html = await res.text()
    const $ = cheerio.load(html)

    const title = $('meta[property="og:title"]').attr("content") || $('title').text().trim()
    const image = $('meta[property="og:image"]').attr("content")

    let files = {}
    const scripts = $('script').filter((i, el) => $(el).html()?.includes('html5player'))
    const script = scripts.html() || ''

    const lowMatch = script.match(/html5player\.setVideoUrlLow\('(.*?)'\)/)
    const highMatch = script.match(/html5player\.setVideoUrlHigh\('(.*?)'\)/)

    if (lowMatch) files.low = lowMatch[1]
    if (highMatch) files.high = highMatch[1]

    let info = $("span.metadata").text() || ""
    let dur = info.match(/(\d+\s?min)/i)?.[0] || 'Desconocida'
    let qual = info.match(/([0-9]{3,4}p)/i)?.[0] || 'Desconocida'
    let views = info.match(/([0-9.,]+)\s*(views|vistas)/i)?.[1]?.replace(/[.,]/g, '') || 'Desconocidas'

    return { result: { title, image, info: { dur, qual, views }, files } }
}

async function search(query) {
    const res = await fetch(`https://www.xnxx.com/search/\( {query}/ \){Math.floor(Math.random() * 3) + 1}`)
    const html = await res.text()
    const $ = cheerio.load(html)
    const results = []

    $('div.mozaique div.thumb-under').each((i, el) => {
        const href = $(el).find('a').attr('href')
        if (!href) return
        const url = 'https://www.xnxx.com' + href
        const title = $(el).find('a').attr('title') || $(el).find('span').text().trim() || 'Sin título'
        results.push({ title, link: url })
    })

    return { result: results }
}

handler.help = ['xnxx <título o url>']
handler.tags = ['nsfw']
handler.command = ['xnxx']
handler.nsfw = true

export default handler