// ═══════════════════════════════════════════
//   HACK PLUGIN — Versión Realista Completa
// ═══════════════════════════════════════════

// TACs reales por marca (primeros 8 dígitos del IMEI)
const DEVICE_TACS = {
    'Samsung Galaxy S23':       '35367411',
    'Samsung Galaxy A54':       '35261511',
    'Xiaomi Redmi Note 12':     '86741305',
    'Xiaomi Redmi 10C':         '86531705',
    'iPhone 14 Pro':            '35332511',
    'iPhone 13':                '35394711',
    'OPPO A78':                 '86751904',
    'Motorola G84':             '35923311',
    'Huawei P30 Lite':          '86699203',
    'Realme C33':               '86741605',
}

// Datos por país: IP ranges reales, coords por ciudad, operadores
const COUNTRY_DATA = {
    '57': {
        name: 'Colombia', flag: '🇨🇴', tz: 'UTC-5',
        ipRanges: ['181.33', '181.49', '181.50', '190.24', '190.25', '157.253'],
        cities: {
            'Bogotá':      { coords: '4.7110°N, 74.0721°W', area: '91' },
            'Medellín':    { coords: '6.2442°N, 75.5812°W', area: '4' },
            'Cali':        { coords: '3.4516°N, 76.5319°W', area: '2' },
            'Barranquilla':{ coords: '10.9685°N, 74.7813°W', area: '5' },
            'Bucaramanga': { coords: '7.1193°N, 73.1227°W', area: '7' },
        },
        isps: ['Claro Colombia', 'Movistar Colombia', 'Tigo Colombia', 'ETB', 'Une EPM'],
        emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'],
        commonNames: ['carlos', 'juan', 'andres', 'santiago', 'miguel', 'valentina', 'sofia'],
    },
    '52': {
        name: 'México', flag: '🇲🇽', tz: 'UTC-6',
        ipRanges: ['187.141', '187.188', '189.247', '201.131', '148.240'],
        cities: {
            'Ciudad de México': { coords: '19.4326°N, 99.1332°W', area: '55' },
            'Guadalajara':      { coords: '20.6597°N, 103.3496°W', area: '33' },
            'Monterrey':        { coords: '25.6866°N, 100.3161°W', area: '81' },
            'Puebla':           { coords: '19.0414°N, 98.2063°W', area: '22' },
            'Tijuana':          { coords: '32.5027°N, 117.0037°W', area: '66' },
        },
        isps: ['Telcel', 'AT&T México', 'Movistar MX', 'Megacable', 'Izzi Telecom'],
        emailDomains: ['gmail.com', 'hotmail.com', 'yahoo.com.mx', 'protonmail.com'],
        commonNames: ['jose', 'luis', 'jorge', 'miguel', 'carlos', 'maria', 'ana'],
    },
    '58': {
        name: 'Venezuela', flag: '🇻🇪', tz: 'UTC-4',
        ipRanges: ['190.202', '190.203', '186.168', '200.44'],
        cities: {
            'Caracas':    { coords: '10.4806°N, 66.9036°W', area: '212' },
            'Maracaibo':  { coords: '10.6316°N, 71.6427°W', area: '261' },
            'Valencia':   { coords: '10.1628°N, 67.9928°W', area: '241' },
            'Barquisimeto':{ coords: '10.0647°N, 69.3574°W', area: '251' },
        },
        isps: ['CANTV', 'Digitel', 'Movistar VE', 'Inter'],
        emailDomains: ['gmail.com', 'hotmail.com', 'yahoo.com'],
        commonNames: ['carlos', 'luis', 'jose', 'antonio', 'pedro', 'maria', 'ana'],
    },
    '51': {
        name: 'Perú', flag: '🇵🇪', tz: 'UTC-5',
        ipRanges: ['181.65', '181.176', '190.232', '200.60'],
        cities: {
            'Lima':       { coords: '12.0464°S, 77.0428°W', area: '1' },
            'Arequipa':   { coords: '16.3988°S, 71.5350°W', area: '54' },
            'Trujillo':   { coords: '8.1116°S, 79.0288°W', area: '44' },
            'Cusco':      { coords: '13.5226°S, 71.9673°W', area: '84' },
        },
        isps: ['Claro Perú', 'Movistar PE', 'Entel PE', 'Bitel'],
        emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com'],
        commonNames: ['juan', 'carlos', 'jose', 'luis', 'ana', 'rosa', 'maria'],
    },
    '54': {
        name: 'Argentina', flag: '🇦🇷', tz: 'UTC-3',
        ipRanges: ['181.10', '190.191', '200.49', '186.0'],
        cities: {
            'Buenos Aires': { coords: '34.6037°S, 58.3816°W', area: '11' },
            'Córdoba':      { coords: '31.4201°S, 64.1888°W', area: '351' },
            'Rosario':      { coords: '32.9442°S, 60.6505°W', area: '341' },
            'Mendoza':      { coords: '32.8895°S, 68.8458°W', area: '261' },
        },
        isps: ['Personal', 'Claro AR', 'Movistar AR', 'Telecentro'],
        emailDomains: ['gmail.com', 'hotmail.com', 'fibertel.com.ar', 'outlook.com'],
        commonNames: ['martin', 'nicolas', 'diego', 'lucas', 'pablo', 'florencia', 'camila'],
    },
    '56': {
        name: 'Chile', flag: '🇨🇱', tz: 'UTC-4',
        ipRanges: ['190.98', '190.99', '181.43', '200.72'],
        cities: {
            'Santiago':    { coords: '33.4489°S, 70.6693°W', area: '2' },
            'Valparaíso':  { coords: '33.0472°S, 71.6127°W', area: '32' },
            'Concepción':  { coords: '36.8270°S, 73.0503°W', area: '41' },
            'La Serena':   { coords: '29.9027°S, 71.2520°W', area: '51' },
        },
        isps: ['Entel CL', 'Movistar CL', 'WOM', 'Claro CL', 'VTR'],
        emailDomains: ['gmail.com', 'hotmail.com', 'vtr.net', 'outlook.com'],
        commonNames: ['sebastian', 'nicolas', 'diego', 'matias', 'felipe', 'camila', 'valentina'],
    },
    '55': {
        name: 'Brasil', flag: '🇧🇷', tz: 'UTC-3',
        ipRanges: ['177.8', '177.66', '189.28', '200.147', '187.0'],
        cities: {
            'São Paulo':    { coords: '23.5505°S, 46.6333°W', area: '11' },
            'Rio de Janeiro':{ coords: '22.9068°S, 43.1729°W', area: '21' },
            'Brasília':     { coords: '15.7942°S, 47.8825°W', area: '61' },
            'Salvador':     { coords: '12.9714°S, 38.5014°W', area: '71' },
            'Fortaleza':    { coords: '3.7172°S, 38.5433°W', area: '85' },
        },
        isps: ['Vivo', 'Claro BR', 'TIM', 'Oi', 'NET Claro'],
        emailDomains: ['gmail.com', 'hotmail.com', 'uol.com.br', 'terra.com.br'],
        commonNames: ['lucas', 'gabriel', 'mateus', 'pedro', 'joao', 'ana', 'julia'],
    },
    '34': {
        name: 'España', flag: '🇪🇸', tz: 'UTC+2',
        ipRanges: ['81.33', '83.165', '88.6', '90.168', '217.127'],
        cities: {
            'Madrid':    { coords: '40.4168°N, 3.7038°W', area: '91' },
            'Barcelona': { coords: '41.3851°N, 2.1734°E', area: '93' },
            'Valencia':  { coords: '39.4699°N, 0.3763°W', area: '96' },
            'Sevilla':   { coords: '37.3891°N, 5.9845°W', area: '95' },
        },
        isps: ['Movistar ES', 'Vodafone ES', 'Orange ES', 'MásMóvil', 'Jazztel'],
        emailDomains: ['gmail.com', 'hotmail.com', 'yahoo.es', 'outlook.es'],
        commonNames: ['alejandro', 'pablo', 'sergio', 'daniel', 'carlos', 'laura', 'maria'],
    },
    '1': {
        name: 'Estados Unidos', flag: '🇺🇸', tz: 'UTC-5',
        ipRanges: ['72.229', '174.205', '98.116', '104.28', '76.89'],
        cities: {
            'New York':    { coords: '40.7128°N, 74.0060°W', area: '212' },
            'Los Angeles': { coords: '34.0522°N, 118.2437°W', area: '213' },
            'Chicago':     { coords: '41.8781°N, 87.6298°W', area: '312' },
            'Houston':     { coords: '29.7604°N, 95.3698°W', area: '713' },
            'Miami':       { coords: '25.7617°N, 80.1918°W', area: '305' },
        },
        isps: ['AT&T', 'Verizon', 'T-Mobile', 'Comcast', 'Spectrum'],
        emailDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'],
        commonNames: ['james', 'john', 'robert', 'michael', 'william', 'emma', 'olivia'],
    },
    '44': {
        name: 'Reino Unido', flag: '🇬🇧', tz: 'UTC+1',
        ipRanges: ['86.3', '90.218', '82.44', '109.145'],
        cities: {
            'London':     { coords: '51.5074°N, 0.1278°W', area: '20' },
            'Manchester': { coords: '53.4808°N, 2.2426°W', area: '161' },
            'Birmingham': { coords: '52.4862°N, 1.8904°W', area: '121' },
        },
        isps: ['EE', 'O2 UK', 'Vodafone UK', 'Three UK', 'Sky Mobile'],
        emailDomains: ['gmail.com', 'hotmail.co.uk', 'yahoo.co.uk', 'outlook.com'],
        commonNames: ['james', 'oliver', 'harry', 'george', 'jack', 'emily', 'olivia'],
    },
}

const FALLBACK_COUNTRY = {
    name: 'Desconocido', flag: '🌐', tz: 'UTC+0',
    ipRanges: ['192.168', '10.0', '172.16'],
    cities: { 'Unknown': { coords: '0.0000°N, 0.0000°E', area: '0' } },
    isps: ['Unknown ISP'],
    emailDomains: ['gmail.com'],
    commonNames: ['user'],
}

// Mensajes falsos interceptados por tema
const FAKE_MESSAGES = [
    ['❤️ te extraño mucho bb', 'cuando nos vemos?', 'jajaja eres un loco'],
    ['bro pasame la tarea', 'ya vi el partido, fue una locura', 'oye llámame cuando puedas'],
    ['ya llegué a casa', 'qué vas a hacer hoy?', 'me mandas el número de juan?'],
    ['happy birthday!! 🎂', 'ven a la fiesta el sábado', 'oye vi tu historia jajaj'],
    ['no te creo nada', 'en serio te lo juro', 'bueno ya te cuento después'],
]

function detectCountry(phone) {
    for (const len of [3, 2, 1]) {
        const prefix = phone.slice(0, len)
        if (COUNTRY_DATA[prefix]) return COUNTRY_DATA[prefix]
    }
    return FALLBACK_COUNTRY
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateIP(ranges) {
    const base = pickRandom(ranges)
    return `${base}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`
}

function generateIMEI(device) {
    const tac = DEVICE_TACS[device] || '35000000'
    const serial = String(Math.floor(Math.random() * 999999)).padStart(6, '0')
    const partial = tac + serial
    // Luhn checksum real
    let sum = 0
    for (let i = 0; i < partial.length; i++) {
        let d = parseInt(partial[partial.length - 1 - i])
        if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
        sum += d
    }
    const check = (10 - (sum % 10)) % 10
    return partial + check
}

function generatePassword(phone, names) {
    const year = String(2000 + Math.floor(Math.random() * 23))
    const name = pickRandom(names)
    const num = String(Math.floor(Math.random() * 9999)).padStart(4, '0')
    const phoneSuffix = phone.slice(-4)
    const patterns = [
        `${name}${year}`,
        `${name}${phoneSuffix}`,
        `${name.charAt(0).toUpperCase() + name.slice(1)}${num}!`,
        `${phoneSuffix}${name}*`,
        `${year}${name}${num.slice(0,2)}`,
    ]
    return pickRandom(patterns)
}

function generateActiveTime(tz) {
    // Hora activa realista: entre 8am y 11:30pm hora local
    const offset = parseInt(tz.replace('UTC', '')) || 0
    const baseHour = 8 + Math.floor(Math.random() * 15) // 8-23
    const min = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    return `${String(baseHour).padStart(2, '0')}:${min}:${sec} (${tz})`
}

function generateMAC() {
    // Primer byte par = unicast
    const first = (Math.floor(Math.random() * 127) * 2).toString(16).padStart(2, '0').toUpperCase()
    const rest = [...Array(5)].map(() =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    )
    return [first, ...rest].join(':')
}

// ─── HANDLER PRINCIPAL ───────────────────────────────────────────
let handler = async (m, { conn }) => {
    await m.react('⌛')

    const target    = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
    const shortName = '@' + target.split('@')[0]
    const phone     = target.split('@')[0]

    // Detección real
    const loc      = detectCountry(phone)
    const cityName = pickRandom(Object.keys(loc.cities))
    const cityData = loc.cities[cityName]
    const isp      = pickRandom(loc.isps)
    const device   = pickRandom(Object.keys(DEVICE_TACS))
    const browsers = ['Chrome 124 / Android 13', 'Safari 17.4 / iOS 17', 'Chrome 123 / MIUI 14', 'Samsung Browser 24']
    const browser  = pickRandom(browsers)

    // Datos generados con lógica real
    const fakeIP     = generateIP(loc.ipRanges)
    const fakeMAC    = generateMAC()
    const fakeIMEI   = generateIMEI(device)
    const fakeSIM    = `89${phone.slice(0, 4)}${String(Math.floor(Math.random() * 1e13)).padStart(13, '0')}`
    const fakeEmail  = `${pickRandom(loc.commonNames)}.${phone.slice(-4)}@${pickRandom(loc.emailDomains)}`
    const fakePass   = generatePassword(phone, loc.commonNames)
    const fakeTime   = generateActiveTime(loc.tz)
    const fakeCoords = cityData.coords
    const fakeArea   = cityData.area
    const msgs       = pickRandom(FAKE_MESSAGES)

    const steps = [
        `💻 Iniciando intrusión contra ${shortName}...`,
        `📡 Número detectado: +${phone}`,
        `🌍 Prefijo internacional → ${loc.name} ${loc.flag}`,
        `🏙️ Ciudad estimada: ${cityName} (área ${fakeArea})`,
        `🔌 ISP identificado: ${isp}`,
        `🖥️ Dispositivo: ${device}`,
        `🌐 IP pública resuelta: ${fakeIP}`,
        `🔍 Escaneando puertos abiertos...`,
        `🔐 Credenciales comprometidas...`,
        `💬 Interceptando mensajes recientes...`,
        `📂 Accediendo al almacenamiento interno...`,
        `📤 Extrayendo datos...`,
        `🧹 Limpiando rastros del sistema...`,
        `✅ Acceso total obtenido`
    ]

    const { key } = await conn.sendMessage(m.chat, { text: '⏳ Iniciando proceso...' }, { quoted: m })

    for (let i = 0; i < steps.length; i++) {
        const progress = Math.floor(((i + 1) / steps.length) * 100)
        const filled   = Math.floor(progress / 10)
        const bar      = '▰'.repeat(filled) + '▱'.repeat(10 - filled)
        await conn.sendMessage(m.chat, {
            text: `${steps[i]}\n\n[${bar}] ${progress}%`,
            edit: key
        })
        await new Promise(r => setTimeout(r, 900 + Math.floor(Math.random() * 700)))
    }

    const final =
        `☠️ *HACK COMPLETADO — REPORTE FINAL*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Objetivo:* ${shortName}\n` +
        `📱 *Número:* +${phone}\n\n` +
        `🌍 *UBICACIÓN*\n` +
        `• País: ${loc.name} ${loc.flag}\n` +
        `• Ciudad: ${cityName}\n` +
        `• Coordenadas: ${fakeCoords}\n` +
        `• Zona horaria: ${loc.tz}\n\n` +
        `🌐 *RED*\n` +
        `• IP pública: ${fakeIP}\n` +
        `• Dirección MAC: ${fakeMAC}\n` +
        `• ISP: ${isp}\n\n` +
        `📲 *DISPOSITIVO*\n` +
        `• Modelo: ${device}\n` +
        `• Navegador: ${browser}\n` +
        `• IMEI: ${fakeIMEI}\n` +
        `• SIM (ICCID): ${fakeSIM}\n\n` +
        `🔑 *CREDENCIALES*\n` +
        `• Email: ${fakeEmail}\n` +
        `• Contraseña: ${fakePass}\n` +
        `• Última conexión: ${fakeTime}\n\n` +
        `💬 *MENSAJES INTERCEPTADOS*\n` +
        msgs.map((msg, i) => `• [${i + 1}] "${msg}"`).join('\n') + '\n\n' +
        `━━━━━━━━━━━━━━━━━━\n` +
        `_Datos extraídos y almacenados correctamente._`

    await conn.sendMessage(m.chat, { text: final, edit: key })
    await m.react('💀')
}

handler.help = ['hack @user']
handler.tags = ['fun']
handler.command = ['hack']
export default handler
