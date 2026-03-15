import { rewriteText } from '../utils/textTools.js'

let handler = async (m, { text }) => {

if (!text) return m.reply('Escribe un texto.')

let styles = [
`🔠 Uppercase:\n${rewriteText(text,'uppercase')}`,
`🔡 Lowercase:\n${rewriteText(text,'lowercase')}`,
`✍️ Italic:\n${rewriteText(text,'italic')}`,
`🔁 Reverse:\n${rewriteText(text,'reverse')}`
]

m.reply(styles.join('\n\n'))

}

handler.help = ['textstyle']
handler.tags = ['tools']
handler.command = ['textstyle','style']

export default handler