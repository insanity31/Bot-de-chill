import { getRandomEmoji, getRandomRomanticResponse } from '../utils/textTools.js'

let handler = async (m, { conn }) => {

let emoji = getRandomEmoji()
let love = getRandomRomanticResponse()

await conn.sendMessage(m.chat, {
text: `${emoji} ${love} ${emoji}`
}, { quoted: m })

}

handler.help = ['love']
handler.tags = ['fun']
handler.command = ['love']

export default handler