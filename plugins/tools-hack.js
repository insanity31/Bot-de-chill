let handler = async (m, { conn, text }) => {
    await m.react('⏳')

    // Detectar objetivo
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
    let shortName = '@' + target.split('@')[0]

    const steps = [
        `💻 Iniciando hackeo contra ${shortName}...`,
        '🔌 Conectando a servidores remotos...',
        '📡 Rastreando IP pública...',
        '🔍 Escaneando puertos...',
        '🔐 Fuerza bruta de credenciales...',
        '📂 Accediendo a archivos personales...',
        '📤 Descargando datos...',
        '🧹 Limpiando evidencias...',
        '✅ Hackeo simulado completado'
    ]

    for (let i = 0; i < steps.length; i++) {
        const progress = Math.floor(((i + 1) / steps.length) * 100)
        const bar = '▰'.repeat(Math.floor(progress / 10)) + '▱'.repeat(10 - Math.floor(progress / 10))
        await m.reply(`\( {steps[i]}\n\n[ \){bar}] ${progress}%`)
        await new Promise(r => setTimeout(r, 1200 + Math.floor(Math.random() * 800)))
    }

    // Datos falsos divertidos
    const fakeIp = `\( {Math.floor(Math.random()*255)}. \){Math.floor(Math.random()*255)}.\( {Math.floor(Math.random()*255)}. \){Math.floor(Math.random()*255)}`
    const fakeEmail = `\( {shortName.replace('@','')} \){Math.floor(Math.random()*999)}@gmail.com`
    const fakePass = `P@ssw0rd${Math.floor(Math.random()*9999)}`
    const fakeTime = `\( {String(Math.floor(Math.random()*24)).padStart(2,'0')}: \){String(Math.floor(Math.random()*60)).padStart(2,'0')}`

    const final = `⚠️ *SIMULACIÓN DE HACKEO COMPLETA*\n\n` +
                  `Objetivo: ${shortName}\n` +
                  `IP: ${fakeIp}\n` +
                  `Email: ${fakeEmail}\n` +
                  `Contraseña: ${fakePass}\n` +
                  `Última conexión: ${fakeTime}\n\n` +
                  `(Esto es solo un prank divertido. No contiene datos reales.)`

    await m.reply(final)
    await m.react('💗')
}

handler.help = ['hack @user']
handler.tags = ['fun']
handler.command = ['hack']

export default handler