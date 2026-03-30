import { database } from '../lib/database.js'
import { createHash } from 'crypto'
import fetch from 'node-fetch'

const Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async (m, { conn, args, prefix }) => {
    const text = args.join(' ')
    const user = database.data.users[m.sender]
    const name2 = m.pushName || 'Darling'
    const zeroImg = 'https://causas-files.vercel.app/fl/9vs2.jpg'

    if (user.registered) return m.reply(
        `🗿 *Ya estás registrado we eres idiota?*\n\n 🎭 Si quieres eliminar tu registro usa:\n*${prefix}unreg*`
    )

    if (!Reg.test(text)) return m.reply(
        `𖤐 *Registro - insanity* 🎭\n\n*Formato correcto:*\n${prefix}reg nombre.edad\n\n*Ejemplo:*\n${prefix}reg ${name2}.18\n\n 🗿 ¡Regístrate para usar todas mis funciones!`
    )

    let [_, name, age] = text.match(Reg)
    if (!name) return m.reply('🗣️ El nombre no puede estar vacío pendejo, no es como si yo fuera a decir "oye ___ es gay"')
    if (!age) return m.reply('😐 La edad no puede estar vacía')
    if (name.length >= 30) return m.reply('😐 El nombre es muy largo Usa menos de 30 caracteres.')
    age = parseInt(age)
    if (age > 100) return m.reply('😐 Esa edad es demasiado alta, ni que fueras dinosaurio')
    if (age < 10) return m.reply('😐 Eres muy pequeño para usar el bot pero no me importa, miente como ella a ti')

    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true

    const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

    const regbot = `𖤐 *¡REGISTRO EXITOSO!* 🎭\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *ID:* ${sn}\n\n🎭 *¡Bienvenido/a, !*\n\nHmph... más te vale usar el bot bien o ban 💢`

    await m.react('🎭')

    let thumbBuffer = null
    try {
        const res = await fetch(zeroImg)
        thumbBuffer = Buffer.from(await res.arrayBuffer())
    } catch (e) {
        console.error('Error descargando imagen:', e)
    }

    await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: 'insanity×፝֟͜×♱卐 - Registro 🎭',
                body: 'insanity 🎭',
                thumbnail: thumbBuffer,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })

    await database.save()
}

handler.help = ['reg']
handler.tags = ['main']
handler.command = ['reg', 'register', 'registrar']

export default handler
