import { rewriteText } from '../utils/textTools.js'

let handler = async (m, { text }) => {
    if (!text) return m.reply('✏️ *Escribe un texto para transformar.*\n\nEjemplo: .textstyle Hola mundo')

    let styles = []

    // Solo agregar estilos que funcionen
    try {
        styles.push(
            `🔠 *Mayúsculas:*\n${rewriteText(text, 'uppercase')}`,
            `🔡 *Minúsculas:*\n${rewriteText(text, 'lowercase')}`,
            `✍️ *Itálica:*\n${rewriteText(text, 'italic')}`,
            `🔄 *Invertido:*\n${rewriteText(text, 'reverse')}`,
            `🎯 *Capitalizado:*\n${rewriteText(text, 'capitalize')}`,
            `💫 *Alternado:*\n${rewriteText(text, 'alternate')}`
        )
    } catch (err) {
        console.error('Error en transformación:', err)
        return m.reply('❌ Error al transformar el texto. Verifica que todas las funciones existan.')
    }

    // Limitar a 4 estilos para no saturar (opcional)
    // m.reply(styles.slice(0, 4).join('\n\n━━━━━━━━━━━━━━━━━━\n\n'))
    
    m.reply(styles.join('\n\n━━━━━━━━━━━━━━━━━━\n\n'))
}

handler.help = ['textstyle <texto>']
handler.tags = ['tools']
handler.command = ['textstyle', 'style']

export default handler
