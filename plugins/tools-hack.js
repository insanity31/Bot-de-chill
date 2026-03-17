// ═══════════════════════════════════════════
//   HACK PLUGIN — Detección real por operador
// ═══════════════════════════════════════════

// Prefijos móviles reales por operador y sus rangos IP (ASN públicos)
const OPERATOR_MAP = {
    // ── COLOMBIA (57) ──────────────────────────────
    '3001': { op: 'Claro CO',     ipRanges: ['181.49', '181.33', '181.50'] },
    '3002': { op: 'Claro CO',     ipRanges: ['181.49', '181.33'] },
    '3003': { op: 'Claro CO',     ipRanges: ['181.49', '181.50'] },
    '3004': { op: 'Claro CO',     ipRanges: ['181.33', '181.50'] },
    '3005': { op: 'Claro CO',     ipRanges: ['181.49', '181.33'] },
    '3100': { op: 'Tigo CO',      ipRanges: ['190.24', '190.25', '190.26'] },
    '3101': { op: 'Tigo CO',      ipRanges: ['190.24', '190.25'] },
    '3102': { op: 'Tigo CO',      ipRanges: ['190.25', '190.26'] },
    '3110': { op: 'Tigo CO',      ipRanges: ['190.24', '190.25'] },
    '3111': { op: 'Tigo CO',      ipRanges: ['190.24', '190.26'] },
    '3200': { op: 'Movistar CO',  ipRanges: ['190.85', '181.132', '190.86'] },
    '3201': { op: 'Movistar CO',  ipRanges: ['190.85', '181.132'] },
    '3202': { op: 'Movistar CO',  ipRanges: ['181.132', '190.86'] },
    '3210': { op: 'Movistar CO',  ipRanges: ['190.85', '190.86'] },
    '3500': { op: 'WOM CO',       ipRanges: ['190.248', '190.249'] },
    '3501': { op: 'WOM CO',       ipRanges: ['190.248', '190.249'] },
    '3040': { op: 'Virgin CO',    ipRanges: ['200.21', '200.22'] },
    '3041': { op: 'Virgin CO',    ipRanges: ['200.21'] },
    '3380': { op: 'ETB Móvil',    ipRanges: ['200.118', '190.60'] },
    '3240': { op: 'Une EPM',      ipRanges: ['190.248', '200.118'] },

    // ── MÉXICO (52) ────────────────────────────────
    '1': { op: 'Telcel MX',       ipRanges: ['187.141', '187.188', '201.131'] },
    '2': { op: 'Telcel MX',       ipRanges: ['187.141', '189.247'] },
    '3': { op: 'AT&T MX',         ipRanges: ['189.203', '201.175', '187.213'] },
    '4': { op: 'AT&T MX',         ipRanges: ['189.203', '201.175'] },
    '5': { op: 'Movistar MX',     ipRanges: ['189.216', '200.57', '201.116'] },
    '6': { op: 'Movistar MX',     ipRanges: ['189.216', '200.57'] },
    '7': { op: 'Unefon MX',       ipRanges: ['201.131', '187.141'] },
    '8': { op: 'Bait MX',         ipRanges: ['187.188', '201.131'] },

    // ── VENEZUELA (58) ─────────────────────────────
    '4120': { op: 'Movistar VE',  ipRanges: ['190.202', '190.203'] },
    '4121': { op: 'Movistar VE',  ipRanges: ['190.202', '190.203'] },
    '4122': { op: 'Movistar VE',  ipRanges: ['190.202'] },
    '4140': { op: 'Digitel VE',   ipRanges: ['186.168', '186.169'] },
    '4141': { op: 'Digitel VE',   ipRanges: ['186.168', '186.170'] },
    '4142': { op: 'Digitel VE',   ipRanges: ['186.168'] },
    '4160': { op: 'Movilnet VE',  ipRanges: ['200.44', '200.45'] },
    '4161': { op: 'Movilnet VE',  ipRanges: ['200.44'] },
    '4165': { op: 'Movilnet VE',  ipRanges: ['200.44', '200.45'] },

    // ── PERÚ (51) ──────────────────────────────────
    '9510': { op: 'Movistar PE',  ipRanges: ['190.232', '190.233'] },
    '9511': { op: 'Movistar PE',  ipRanges: ['190.232'] },
    '9900': { op: 'Claro PE',     ipRanges: ['181.65', '181.176'] },
    '9901': { op: 'Claro PE',     ipRanges: ['181.65'] },
    '9760': { op: 'Entel PE',     ipRanges: ['200.60', '200.61'] },
    '9761': { op: 'Entel PE',     ipRanges: ['200.60'] },
    '9740': { op: 'Bitel PE',     ipRanges: ['181.176', '200.60'] },

    // ── ARGENTINA (54) ─────────────────────────────
    '911':  { op: 'Personal AR',  ipRanges: ['181.10', '181.11'] },
    '9111': { op: 'Personal AR',  ipRanges: ['181.10'] },
    '9112': { op: 'Personal AR',  ipRanges: ['181.11'] },
    '9150': { op: 'Claro AR',     ipRanges: ['190.191', '190.192'] },
    '9151': { op: 'Claro AR',     ipRanges: ['190.191'] },
    '9160': { op: 'Movistar AR',  ipRanges: ['200.49', '200.50'] },
    '9161': { op: 'Movistar AR',  ipRanges: ['200.49'] },

    // ── CHILE (56) ─────────────────────────────────
    '9':    { op: 'Entel CL',     ipRanges: ['190.98', '190.99'] },
    '98':   { op: 'Movistar CL',  ipRanges: ['181.43', '181.44'] },
    '99':   { op: 'Claro CL',     ipRanges: ['200.72', '200.73'] },
    '97':   { op: 'WOM CL',       ipRanges: ['190.248', '190.249'] },
    '96':   { op: 'VTR Móvil',    ipRanges: ['200.72'] },

    // ── BRASIL (55) ────────────────────────────────
    '119':  { op: 'Vivo BR',      ipRanges: ['177.8', '177.9'] },
    '118':  { op: 'Claro BR',     ipRanges: ['177.66', '189.28'] },
    '117':  { op: 'TIM BR',       ipRanges: ['187.0', '187.1'] },
    '116':  { op: 'Oi BR',        ipRanges: ['200.147', '200.148'] },

    // ── ESPAÑA (34) ────────────────────────────────
    '6':    { op: 'Movistar ES',  ipRanges: ['81.33', '83.165'] },
    '61':   { op: 'Vodafone ES',  ipRanges: ['88.6', '88.7'] },
    '62':   { op: 'Orange ES',    ipRanges: ['90.168', '90.169'] },
    '63':   { op: 'MásMóvil',     ipRanges: ['217.127', '217.128'] },
    '65':   { op: 'Jazztel',      ipRanges: ['83.165', '88.6'] },

    // ── ESTADOS UNIDOS (1) ─────────────────────────
    '201':  { op: 'AT&T US',      ipRanges: ['72.229', '76.89'] },
    '202':  { op: 'Verizon US',   ipRanges: ['174.205', '98.116'] },
    '212':  { op: 'T-Mobile US',  ipRanges: ['104.28', '172.56'] },
    '213':  { op: 'Comcast US',   ipRanges: ['76.89', '98.116'] },
    '305':  { op: 'Spectrum US',  ipRanges: ['72.229', '104.28'] },

    // ── REINO UNIDO (44) ───────────────────────────
    '74':   { op: 'EE UK',        ipRanges: ['86.3', '86.4'] },
    '75':   { op: 'O2 UK',        ipRanges: ['90.218', '90.219'] },
    '77':   { op: 'Vodafone UK',  ipRanges: ['82.44', '82.45'] },
    '78':   { op: 'Three UK',     ipRanges: ['109.145', '109.146'] },
    '79':   { op: 'Sky Mobile',   ipRanges: ['86.3', '90.218'] },
}

// Datos por país (sin ipRanges, esos vienen del operador)
const COUNTRY_DATA = {
    '57': {
        name: 'Colombia', flag: '🇨🇴', tz: 'UTC-5',
        cities: {
            'Bogotá':       { coords: '4.7110°N, 74.0721°W' },
            'Medellín':     { coords: '6.2442°N, 75.5812°W' },
            'Cali':         { coords: '3.4516°N, 76.5319°W' },
            'Barranquilla': { coords: '10.9685°N, 74.7813°W' },
            'Bucaramanga':  { coords: '7.1193°N, 73.1227°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com'],
        commonNames:  ['carlos', 'juan', 'andres', 'santiago', 'valentina', 'sofia'],
        fallbackIPs:  ['181.49', '190.24', '190.85'],
        fallbackOp:   'Claro CO',
    },
    '52': {
        name: 'México', flag: '🇲🇽', tz: 'UTC-6',
        cities: {
            'Ciudad de México': { coords: '19.4326°N, 99.1332°W' },
            'Guadalajara':      { coords: '20.6597°N, 103.3496°W' },
            'Monterrey':        { coords: '25.6866°N, 100.3161°W' },
            'Puebla':           { coords: '19.0414°N, 98.2063°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com', 'yahoo.com.mx'],
        commonNames:  ['jose', 'luis', 'jorge', 'carlos', 'maria', 'ana'],
        fallbackIPs:  ['187.141', '189.247'],
        fallbackOp:   'Telcel MX',
    },
    '58': {
        name: 'Venezuela', flag: '🇻🇪', tz: 'UTC-4',
        cities: {
            'Caracas':     { coords: '10.4806°N, 66.9036°W' },
            'Maracaibo':   { coords: '10.6316°N, 71.6427°W' },
            'Valencia':    { coords: '10.1628°N, 67.9928°W' },
            'Barquisimeto':{ coords: '10.0647°N, 69.3574°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com'],
        commonNames:  ['carlos', 'luis', 'jose', 'maria', 'ana'],
        fallbackIPs:  ['190.202', '186.168'],
        fallbackOp:   'Movistar VE',
    },
    '51': {
        name: 'Perú', flag: '🇵🇪', tz: 'UTC-5',
        cities: {
            'Lima':      { coords: '12.0464°S, 77.0428°W' },
            'Arequipa':  { coords: '16.3988°S, 71.5350°W' },
            'Trujillo':  { coords: '8.1116°S, 79.0288°W' },
            'Cusco':     { coords: '13.5226°S, 71.9673°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com'],
        commonNames:  ['juan', 'carlos', 'jose', 'ana', 'rosa'],
        fallbackIPs:  ['181.65', '190.232'],
        fallbackOp:   'Claro PE',
    },
    '54': {
        name: 'Argentina', flag: '🇦🇷', tz: 'UTC-3',
        cities: {
            'Buenos Aires': { coords: '34.6037°S, 58.3816°W' },
            'Córdoba':      { coords: '31.4201°S, 64.1888°W' },
            'Rosario':      { coords: '32.9442°S, 60.6505°W' },
            'Mendoza':      { coords: '32.8895°S, 68.8458°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com', 'fibertel.com.ar'],
        commonNames:  ['martin', 'nicolas', 'diego', 'lucas', 'camila'],
        fallbackIPs:  ['181.10', '190.191'],
        fallbackOp:   'Personal AR',
    },
    '56': {
        name: 'Chile', flag: '🇨🇱', tz: 'UTC-4',
        cities: {
            'Santiago':   { coords: '33.4489°S, 70.6693°W' },
            'Valparaíso': { coords: '33.0472°S, 71.6127°W' },
            'Concepción': { coords: '36.8270°S, 73.0503°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com', 'vtr.net'],
        commonNames:  ['sebastian', 'nicolas', 'matias', 'camila', 'valentina'],
        fallbackIPs:  ['190.98', '181.43'],
        fallbackOp:   'Entel CL',
    },
    '55': {
        name: 'Brasil', flag: '🇧🇷', tz: 'UTC-3',
        cities: {
            'São Paulo':     { coords: '23.5505°S, 46.6333°W' },
            'Rio de Janeiro':{ coords: '22.9068°S, 43.1729°W' },
            'Brasília':      { coords: '15.7942°S, 47.8825°W' },
            'Salvador':      { coords: '12.9714°S, 38.5014°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.com', 'uol.com.br'],
        commonNames:  ['lucas', 'gabriel', 'mateus', 'pedro', 'ana'],
        fallbackIPs:  ['177.8', '189.28'],
        fallbackOp:   'Vivo BR',
    },
    '34': {
        name: 'España', flag: '🇪🇸', tz: 'UTC+2',
        cities: {
            'Madrid':    { coords: '40.4168°N, 3.7038°W' },
            'Barcelona': { coords: '41.3851°N, 2.1734°E' },
            'Valencia':  { coords: '39.4699°N, 0.3763°W' },
            'Sevilla':   { coords: '37.3891°N, 5.9845°W' },
        },
        emailDomains: ['gmail.com', 'yahoo.es', 'outlook.es'],
        commonNames:  ['alejandro', 'pablo', 'sergio', 'daniel', 'laura'],
        fallbackIPs:  ['81.33', '88.6'],
        fallbackOp:   'Movistar ES',
    },
    '1': {
        name: 'Estados Unidos', flag: '🇺🇸', tz: 'UTC-5',
        cities: {
            'New York':    { coords: '40.7128°N, 74.0060°W' },
            'Los Angeles': { coords: '34.0522°N, 118.2437°W' },
            'Chicago':     { coords: '41.8781°N, 87.6298°W' },
            'Miami':       { coords: '25.7617°N, 80.1918°W' },
        },
        emailDomains: ['gmail.com', 'yahoo.com', 'icloud.com'],
        commonNames:  ['james', 'john', 'michael', 'emma', 'olivia'],
        fallbackIPs:  ['72.229', '98.116'],
        fallbackOp:   'AT&T US',
    },
    '44': {
        name: 'Reino Unido', flag: '🇬🇧', tz: 'UTC+1',
        cities: {
            'London':     { coords: '51.5074°N, 0.1278°W' },
            'Manchester': { coords: '53.4808°N, 2.2426°W' },
            'Birmingham': { coords: '52.4862°N, 1.8904°W' },
        },
        emailDomains: ['gmail.com', 'hotmail.co.uk', 'yahoo.co.uk'],
        commonNames:  ['james', 'oliver', 'harry', 'emily', 'olivia'],
        fallbackIPs:  ['86.3', '90.218'],
        fallbackOp:   'EE UK',
    },
}

const DEVICE_TACS = {
    'Samsung Galaxy S23':     '35367411',
    'Samsung Galaxy A54':     '35261511',
    'Xiaomi Redmi Note 12':   '86741305',
    'Xiaomi Redmi 10C':       '86531705',
    'iPhone 14 Pro':          '35332511',
    'iPhone 13':              '35394711',
    'OPPO A78':               '86751904',
    'Motorola G84':           '35923311',
    'Huawei P30 Lite':        '86699203',
    'Realme C33':             '86741605',
}

const FAKE_MESSAGES = [
    ['❤️ te extraño mucho bb', 'cuando nos vemos?', 'jajaja eres un loco'],
    ['bro pasame la tarea', 'ya vi el partido, fue una locura', 'oye llámame cuando puedas'],
    ['ya llegué a casa', 'qué vas a hacer hoy?', 'me mandas el número de juan?'],
    ['happy birthday!! 🎂', 'ven a la fiesta el sábado', 'oye vi tu historia jajaj'],
    ['no te creo nada', 'en serio te lo juro', 'bueno ya te cuento después'],
]

// ─── Helpers ────────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function ri(n)     { return Math.floor(Math.random() * n) }
function pad(n)    { return String(n).padStart(2, '0') }

function detectCountry(phone) {
    for (const len of [3, 2, 1]) {
        const prefix = phone.slice(0, len)
        if (COUNTRY_DATA[prefix]) return { country: COUNTRY_DATA[prefix], countryCode: prefix }
    }
    return { country: null, countryCode: null }
}

// Detecta operador probando prefijos de 4 → 3 → 2 → 1 dígito
// pero solo dentro del número local (sin el código de país)
function detectOperator(phone, countryCode, countryFallback) {
    const local = phone.slice(countryCode.length) // ej: 573001234567 → 3001234567
    for (const len of [4, 3, 2, 1]) {
        const prefix = local.slice(0, len)
        if (OPERATOR_MAP[prefix]) return OPERATOR_MAP[prefix]
    }
    return { op: countryFallback.fallbackOp, ipRanges: countryFallback.fallbackIPs }
}

function generateIP(ranges) {
    const base = pick(ranges)
    return `${base}.${ri(254) + 1}.${ri(254) + 1}`
}

function generateIMEI(device) {
    const tac = DEVICE_TACS[device] || '35000000'
    const serial = String(ri(999999)).padStart(6, '0')
    const partial = tac + serial
    let sum = 0
    for (let i = 0; i < partial.length; i++) {
        let d = parseInt(partial[partial.length - 1 - i])
        if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
        sum += d
    }
    return partial + ((10 - (sum % 10)) % 10)
}

function generatePassword(phone, names) {
    const year = String(2000 + ri(23))
    const name = pick(names)
    const suffix = phone.slice(-4)
    return pick([
        `${name}${year}`,
        `${name}${suffix}`,
        `${name.charAt(0).toUpperCase() + name.slice(1)}${ri(9999)}!`,
        `${suffix}${name}*`,
        `${year}${name}${ri(99)}`,
    ])
}

function generateMAC() {
    const first = (ri(127) * 2).toString(16).padStart(2, '0').toUpperCase()
    const rest = [...Array(5)].map(() => ri(256).toString(16).padStart(2, '0').toUpperCase())
    return [first, ...rest].join(':')
}

function generateActiveTime(tz) {
    const h = 8 + ri(15)
    return `${pad(h)}:${pad(ri(60))}:${pad(ri(60))} (${tz})`
}

// ─── Handler principal ───────────────────────────────────────────
let handler = async (m, { conn }) => {
    await m.react('⌛')

    const target    = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
    const shortName = '@' + target.split('@')[0]
    const phone     = target.split('@')[0]

    // 1. País por prefijo internacional
    const { country, countryCode } = detectCountry(phone)
    const loc = country || {
        name: 'Desconocido', flag: '🌐', tz: 'UTC+0',
        cities: { 'Unknown': { coords: '0.0000°N, 0.0000°E' } },
        emailDomains: ['gmail.com'], commonNames: ['user'],
        fallbackIPs: ['192.168.1'], fallbackOp: 'Unknown ISP',
    }

    // 2. Operador por prefijo local → IP real del operador
    const operatorData = countryCode
        ? detectOperator(phone, countryCode, loc)
        : { op: loc.fallbackOp, ipRanges: loc.fallbackIPs }

    const cityName = pick(Object.keys(loc.cities))
    const coords   = loc.cities[cityName].coords
    const device   = pick(Object.keys(DEVICE_TACS))
    const browsers = ['Chrome 124 / Android 13', 'Safari 17.4 / iOS 17', 'Chrome 123 / MIUI 14', 'Samsung Browser 24']

    const fakeIP    = generateIP(operatorData.ipRanges)  // IP coherente con operador real
    const fakeMAC   = generateMAC()
    const fakeIMEI  = generateIMEI(device)
    const fakeSIM   = `89${phone.slice(0, 4)}${String(ri(1e13)).padStart(13, '0')}`
    const fakeEmail = `${pick(loc.commonNames)}.${phone.slice(-4)}@${pick(loc.emailDomains)}`
    const fakePass  = generatePassword(phone, loc.commonNames)
    const fakeTime  = generateActiveTime(loc.tz)
    const msgs      = pick(FAKE_MESSAGES)

    const steps = [
        `💻 Iniciando intrusión contra ${shortName}...`,
        `📡 Número detectado: +${phone}`,
        `🌍 País identificado: ${loc.name} ${loc.flag}`,
        `📶 Operador detectado: ${operatorData.op}`,
        `🌐 Resolviendo IP pública (${operatorData.op})...`,
        `🏙️ Ciudad estimada: ${cityName}`,
        `🖥️ Dispositivo: ${device}`,
        `🔍 Escaneando puertos en ${fakeIP}...`,
        `🔐 Credenciales comprometidas...`,
        `💬 Interceptando mensajes recientes...`,
        `📤 Extrayendo datos confidenciales...`,
        `🧹 Limpiando rastros...`,
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
        await new Promise(r => setTimeout(r, 900 + ri(700)))
    }

    const final =
        `☠️ *HACK COMPLETADO — REPORTE FINAL*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Objetivo:* ${shortName}\n` +
        `📱 *Número:* +${phone}\n\n` +
        `🌍 *UBICACIÓN*\n` +
        `• País: ${loc.name} ${loc.flag}\n` +
        `• Ciudad: ${cityName}\n` +
        `• Coordenadas: ${coords}\n` +
        `• Zona horaria: ${loc.tz}\n\n` +
        `🌐 *RED*\n` +
        `• Operador: ${operatorData.op}\n` +
        `• IP pública: ${fakeIP}\n` +
        `• Dirección MAC: ${fakeMAC}\n\n` +
        `📲 *DISPOSITIVO*\n` +
        `• Modelo: ${device}\n` +
        `• Navegador: ${pick(browsers)}\n` +
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
