import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    try {
        await m.react('🔍')

        const pluginsDir = './plugins'
        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))

        let response = `✨ *Detección de Errores - insanity* ✨\n\n`
        response += `🔥 Revisando ${files.length} archivos, weit...\n`
        response += `━━━━━━━━━━━━━━━━━━━\n\n`

        let hasErrors = false
        let errorCount = 0

        for (const file of files) {
            try {
                await import(path.resolve(pluginsDir, file))
            } catch (error) {
                hasErrors = true
                errorCount++
                const stackLines = error.stack.split('\n')
                const errorLineMatch = stackLines[0].match(/:(\d+):\d+/)
                const errorLine = errorLineMatch ? errorLineMatch[1] : 'Desconocido'

                response += `😐 *Error encontrado*\n\n`
                response += `📁 *Archivo:* ${file}\n`
                response += `📝 *Mensaje:* ${error.message}\n`
                response += `📍 *Línea:* ${errorLine}\n`
                response += `━━━━━━━━━━━━━━━━━━━\n\n`
            }
        }

        if (!hasErrors) {
            response += `🗣️ *¡Todo perfecto, crack!*\n\n`
            response += `✨ No se detectaron errores de sintaxis\n`
            response += `🗿 Todos los ${files.length} archivos están funcionando correctamente~`
        } else {
            response += `💢 *Resumen de errores:*\n\n`
            response += `❌ Total de errores: ${errorCount}\n`
            response += `📂 Archivos revisados: ${files.length}\n`
            response += `🐢 Revisa los archivos mencionados, mano`
        }

        await m.reply(response)
        await m.react(hasErrors ? '😐' : '🐢')
    } catch (err) {
        await m.react('😐')
        await m.reply(` algo salió mal...\n\n📝 *Error:* ${err.message}`)
    }
}

handler.command = ['detectarsyntax', 'detectar', 'checksyntax']
handler.help = ['detectarsyntax']
handler.tags = ['tools']

export default handler
