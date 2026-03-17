const COUNTRY_CODES = {
    '1':   { name: 'Estados Unidos', flag: '🇺🇸', isps: ['AT&T', 'Verizon', 'T-Mobile'],       cities: ['New York', 'Los Angeles', 'Chicago'],    tz: 'UTC-5' },
    '52':  { name: 'México',         flag: '🇲🇽', isps: ['Telcel', 'AT&T MX', 'Movistar MX'],  cities: ['CDMX', 'Guadalajara', 'Monterrey'],      tz: 'UTC-6' },
    '57':  { name: 'Colombia',       flag: '🇨🇴', isps: ['Claro CO', 'Movistar CO', 'Tigo'],   cities: ['Bogotá', 'Medellín', 'Cali'],            tz: 'UTC-5' },
    '58':  { name: 'Venezuela',      flag: '🇻🇪', isps: ['CANTV', 'Digitel', 'Movistar VE'],   cities: ['Caracas', 'Maracaibo', 'Valencia'],      tz: 'UTC-4' },
    '51':  { name: 'Perú',           flag: '🇵🇪', isps: ['Claro PE', 'Movistar PE', 'Entel'],  cities: ['Lima', 'Arequipa', 'Trujillo'],          tz: 'UTC-5' },
    '54':  { name: 'Argentina',      flag: '🇦🇷', isps: ['Personal', 'Claro AR', 'Movistar AR'],cities: ['Buenos Aires', 'Córdoba', 'Rosario'],   tz: 'UTC-3' },
    '56':  { name: 'Chile',          flag: '🇨🇱', isps: ['Entel CL', 'Movistar CL', 'WOM'],   cities: ['Santiago', 'Valparaíso', 'Concepción'],  tz: 'UTC-4' },
    '55':  { name: 'Brasil',         flag: '🇧🇷', isps: ['Vivo', 'Claro BR', 'TIM'],           cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'],tz: 'UTC-3' },
    '593': { name: 'Ecuador',        flag: '🇪🇨', isps: ['Claro EC', 'Movistar EC', 'CNT'],    cities: ['Quito', 'Guayaquil', 'Cuenca'],          tz: 'UTC-5' },
    '591': { name: 'Bolivia',        flag: '🇧🇴', isps: ['Tigo BO', 'Entel BO', 'Viva'],       cities: ['La Paz', 'Cochabamba', 'Santa Cruz'],    tz: 'UTC-4' },
    '595': { name: 'Paraguay',       flag: '🇵🇾', isps: ['Tigo PY', 'Personal PY', 'Claro PY'],cities: ['Asunción', 'Ciudad del Este'],           tz: 'UTC-4' },
    '598': { name: 'Uruguay',        flag: '🇺🇾', isps: ['Antel', 'Movistar UY', 'Claro UY'],  cities: ['Montevideo', 'Salto'],                   tz: 'UTC-3' },
    '34':  { name: 'España',         flag: '🇪🇸', isps: ['Movistar ES', 'Vodafone ES', 'Orange ES'], cities: ['Madrid', 'Barcelona', 'Sevilla'],  tz: 'UTC+2' },
    '44':  { name: 'Reino Unido',    flag: '🇬🇧', isps: ['EE', 'O2', 'Vodafone UK'],           cities: ['London', 'Manchester', 'Birmingham'],    tz: 'UTC+1' },
    '49':  { name: 'Alemania',       flag: '🇩🇪', isps: ['Telekom DE', 'Vodafone DE', 'O2 DE'],cities: ['Berlin', 'München', 'Hamburg'],          tz: 'UTC+2' },
    '33':  { name: 'Francia',        flag: '🇫🇷', isps: ['Orange FR', 'SFR', 'Bouygues'],      cities: ['Paris', 'Lyon', 'Marseille'],            tz: 'UTC+2' },
    '39':  { name: 'Italia',         flag: '🇮🇹', isps: ['TIM', 'Vodafone IT', 'Wind Tre'],    cities: ['Roma', 'Milano', 'Napoli'],              tz: 'UTC+2' },
    '7':   { name: 'Rusia',          flag: '🇷🇺', isps: ['MTS', 'Beeline', 'MegaFon'],         cities: ['Moskva', 'Sankt-Peterburg', 'Novosibirsk'],tz:'UTC+3'},
    '86':  { name: 'China',          flag: '🇨🇳', isps: ['China Mobile', 'China Unicom'],      cities: ['Beijing', 'Shanghai', 'Shenzhen'],       tz: 'UTC+8' },
    '81':  { name: 'Japón',          flag: '🇯🇵', isps: ['NTT Docomo', 'SoftBank', 'au'],      cities: ['Tokyo', 'Osaka', 'Kyoto'],               tz: 'UTC+9' },
    '91':  { name: 'India',          flag: '🇮🇳', isps: ['Jio', 'Airtel', 'Vi'],              cities: ['Mumbai', 'Delhi', 'Bangalore'],          tz: 'UTC+5:30' },
    '966': { name: 'Arabia Saudita', flag: '🇸🇦', isps: ['STC', 'Mobily', 'Zain SA'],         cities: ['Riyadh', 'Jeddah', 'Mecca'],             tz: 'UTC+3' },
    '971': { name: 'EAU',            flag: '🇦🇪', isps: ['Etisalat', 'du'],                    cities: ['Dubai', 'Abu Dhabi'],                    tz: 'UTC+4' },
}

// Detecta el país real desde el prefijo del JID
function detectCountry(phone) {
    // Intenta primero con 3 dígitos, luego 2, luego 1
    for (const len of [3, 2, 1]) {
        const prefix = phone.slice(0, len)
        if (COUNTRY_CODES[prefix]) return COUNTRY_CODES[prefix]
    }
    // Fallback genérico si el prefijo no está en el mapa
    return { name: 'Desconocido', flag: '🌐', isps: ['Unknown ISP'], cities: ['Unknown City'], tz: 'UTC+0' }
}

let handler = async (m, { conn, text }) => {
    await m.react('⌛')

    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
    let shortName = '@' + target.split('@')[0]
    let phone = target.split('@')[0]

    // — Detección real por prefijo —
    const loc = detectCountry(phone)
    const isp = loc.isps[r(loc.isps.length)]
    const city = loc.cities[r(loc.cities.length)]

    // — Resto de datos falsos —
    const devices   = ['Samsung Galaxy S23', 'Xiaomi Redmi Note 12', 'iPhone 14 Pro', 'OPPO A78', 'Motorola G84']
    const operators = loc.isps  // usa los operadores reales del país
    const browsers  = ['Chrome 124 / Android 13', 'Safari 17 / iOS 17', 'Chrome 123 / MIUI 14']

    const device   = devices[r(devices.length)]
    const operator = operators[r(operators.length)]
    const browser  = browsers[r(browsers.length)]

    const fakeIp     = `${r(200)+10}.${r(255)}.${r(255)}.${r(255)}`
    const fakeMac    = [...Array(6)].map(() => r(256).toString(16).padStart(2,'0').toUpperCase()).join(':')
    const fakeEmail  = `${phone}user${r(999)}@gmail.com`
    const fakePass   = `P@${randomStr(4)}${r(9999)}`
    const fakeTime   = `${pad(r(24))}:${pad(r(60))}:${pad(r(60))}`
    const fakeIMEI   = `35${[...Array(13)].map(() => r(10)).join('')}`
    const fakeSim    = `89${[...Array(17)].map(() => r(10)).join('')}`

    // Coordenadas aproximadas según país (solo flavor)
    const fakeCoords = `${(r(60) - 30 + Math.random()).toFixed(4)}°, ${(r(180) - 90 + Math.random()).toFixed(4)}°`

    function r(n) { return Math.floor(Math.random() * n) }
    function pad(n) { return String(n).padStart(2, '0') }
    function randomStr(len) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
        return [...Array(len)].map(() => chars[r(chars.length)]).join('')
    }

    const steps = [
        `💻 Iniciando intrusión contra ${shortName}...`,
        `📡 Rastreando número +${phone}...`,
        `🌍 Prefijo detectado → ${loc.name} ${loc.flag}`,
        `🔌 Conectando vía ISP: ${isp}...`,
        `🏙️ Ciudad estimada: ${city}`,
        `🖥️ Dispositivo identificado: ${device}`,
        `🔍 Escaneando puertos en ${fakeIp}...`,
        `🔐 Fuerza bruta de credenciales...`,
        `📂 Accediendo al almacenamiento interno...`,
        `📤 Extrayendo datos confidenciales...`,
        `🧹 Limpiando rastros...`,
        `✅ Acceso total obtenido`
    ]

    let { key } = await conn.sendMessage(m.chat, { text: '⏳ Iniciando proceso...' }, { quoted: m })

    for (let i = 0; i < steps.length; i++) {
        const progress = Math.floor(((i + 1) / steps.length) * 100)
        const filled   = Math.floor(progress / 10)
        const bar      = '▰'.repeat(filled) + '▱'.repeat(10 - filled)
        await conn.sendMessage(m.chat, { text: `${steps[i]}\n\n[${bar}] ${progress}%`, edit: key })
        await new Promise(res => setTimeout(res, 900 + r(800)))
    }

    const final =
        `☠️ *HACK COMPLETADO — REPORTE FINAL*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Objetivo:* ${shortName}\n` +
        `📱 *Número:* +${phone}\n\n` +
        `🌍 *UBICACIÓN*\n` +
        `• País: ${loc.name} ${loc.flag}\n` +
        `• Ciudad: ${city}\n` +
        `• Coords: ${fakeCoords}\n` +
        `• Zona horaria: ${loc.tz}\n\n` +
        `🌐 *RED*\n` +
        `• IP pública: ${fakeIp}\n` +
        `• MAC: ${fakeMac}\n` +
        `• ISP: ${isp}\n` +
        `• Operador: ${operator}\n\n` +
        `📲 *DISPOSITIVO*\n` +
        `• Modelo: ${device}\n` +
        `• Navegador: ${browser}\n` +
        `• IMEI: ${fakeIMEI}\n` +
        `• SIM (ICCID): ${fakeSim}\n\n` +
        `🔑 *CREDENCIALES*\n` +
        `• Email: ${fakeEmail}\n` +
        `• Contraseña: ${fakePass}\n` +
        `• Última conexión: ${fakeTime}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `_Datos extraídos y almacenados correctamente._`

    await conn.sendMessage(m.chat, { text: final, edit: key })
    await m.react('💀')
}

handler.help = ['hack @user']
handler.tags = ['fun']
handler.command = ['hack']
export default handler
