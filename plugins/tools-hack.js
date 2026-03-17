// ════════════════════════════════════════════
//   HACK PLUGIN — Solo mapa local, hora real
// ════════════════════════════════════════════

const OPERATOR_MAP = {
    // ── COLOMBIA (57) ──────────────────────────────────
    '3001': { op: 'Claro Colombia',    asn: 'AS13489',  subnet: '181.49',  rdns: 'mobile-{ip}.claro.net.co',          tz: 'America/Bogota'      },
    '3002': { op: 'Claro Colombia',    asn: 'AS13489',  subnet: '181.33',  rdns: 'mobile-{ip}.claro.net.co',          tz: 'America/Bogota'      },
    '3003': { op: 'Claro Colombia',    asn: 'AS13489',  subnet: '181.50',  rdns: 'mobile-{ip}.claro.net.co',          tz: 'America/Bogota'      },
    '3004': { op: 'Claro Colombia',    asn: 'AS13489',  subnet: '181.49',  rdns: 'mobile-{ip}.claro.net.co',          tz: 'America/Bogota'      },
    '3005': { op: 'Claro Colombia',    asn: 'AS13489',  subnet: '181.33',  rdns: 'mobile-{ip}.claro.net.co',          tz: 'America/Bogota'      },
    '3100': { op: 'Tigo Colombia',     asn: 'AS27831',  subnet: '190.24',  rdns: '{ip}.dynamic.tigo.com.co',          tz: 'America/Bogota'      },
    '3101': { op: 'Tigo Colombia',     asn: 'AS27831',  subnet: '190.25',  rdns: '{ip}.dynamic.tigo.com.co',          tz: 'America/Bogota'      },
    '3102': { op: 'Tigo Colombia',     asn: 'AS27831',  subnet: '190.24',  rdns: '{ip}.dynamic.tigo.com.co',          tz: 'America/Bogota'      },
    '3110': { op: 'Tigo Colombia',     asn: 'AS27831',  subnet: '190.25',  rdns: '{ip}.dynamic.tigo.com.co',          tz: 'America/Bogota'      },
    '3111': { op: 'Tigo Colombia',     asn: 'AS27831',  subnet: '190.26',  rdns: '{ip}.dynamic.tigo.com.co',          tz: 'America/Bogota'      },
    '3200': { op: 'Movistar Colombia', asn: 'AS27831',  subnet: '190.85',  rdns: '{ip}.mobile.movistar.net.co',       tz: 'America/Bogota'      },
    '3201': { op: 'Movistar Colombia', asn: 'AS27831',  subnet: '181.132', rdns: '{ip}.mobile.movistar.net.co',       tz: 'America/Bogota'      },
    '3202': { op: 'Movistar Colombia', asn: 'AS27831',  subnet: '190.86',  rdns: '{ip}.mobile.movistar.net.co',       tz: 'America/Bogota'      },
    '3210': { op: 'Movistar Colombia', asn: 'AS27831',  subnet: '190.85',  rdns: '{ip}.mobile.movistar.net.co',       tz: 'America/Bogota'      },
    '3500': { op: 'WOM Colombia',      asn: 'AS262186', subnet: '190.248', rdns: 'user-{ip}.wom.co',                  tz: 'America/Bogota'      },
    '3501': { op: 'WOM Colombia',      asn: 'AS262186', subnet: '190.249', rdns: 'user-{ip}.wom.co',                  tz: 'America/Bogota'      },
    '3040': { op: 'Virgin Colombia',   asn: 'AS10620',  subnet: '200.21',  rdns: '{ip}.virgin.net.co',                tz: 'America/Bogota'      },
    '3380': { op: 'ETB Móvil',         asn: 'AS3816',   subnet: '200.118', rdns: '{ip}.etb.net.co',                   tz: 'America/Bogota'      },
    '3240': { op: 'Une EPM',           asn: 'AS13760',  subnet: '190.248', rdns: '{ip}.une.net.co',                   tz: 'America/Bogota'      },

    // ── MÉXICO (52) ────────────────────────────────────
    '1':  { op: 'Telcel',              asn: 'AS8151',   subnet: '187.141', rdns: '{ip}.mobile.telcel.com',            tz: 'America/Mexico_City' },
    '2':  { op: 'Telcel',              asn: 'AS8151',   subnet: '187.188', rdns: '{ip}.mobile.telcel.com',            tz: 'America/Mexico_City' },
    '3':  { op: 'AT&T México',         asn: 'AS18734',  subnet: '189.203', rdns: '{ip}.iusacell.net',                 tz: 'America/Mexico_City' },
    '4':  { op: 'AT&T México',         asn: 'AS18734',  subnet: '201.175', rdns: '{ip}.iusacell.net',                 tz: 'America/Mexico_City' },
    '5':  { op: 'Movistar México',     asn: 'AS6503',   subnet: '189.216', rdns: '{ip}.movistar.net.mx',              tz: 'America/Mexico_City' },
    '6':  { op: 'Movistar México',     asn: 'AS6503',   subnet: '200.57',  rdns: '{ip}.movistar.net.mx',              tz: 'America/Mexico_City' },
    '8':  { op: 'Bait México',         asn: 'AS8151',   subnet: '187.188', rdns: '{ip}.bait.com.mx',                  tz: 'America/Mexico_City' },

    // ── VENEZUELA (58) ─────────────────────────────────
    '4120': { op: 'Movistar Venezuela', asn: 'AS6306',  subnet: '190.202', rdns: '{ip}.movistar.net.ve',              tz: 'America/Caracas'     },
    '4121': { op: 'Movistar Venezuela', asn: 'AS6306',  subnet: '190.203', rdns: '{ip}.movistar.net.ve',              tz: 'America/Caracas'     },
    '4122': { op: 'Movistar Venezuela', asn: 'AS6306',  subnet: '190.202', rdns: '{ip}.movistar.net.ve',              tz: 'America/Caracas'     },
    '4140': { op: 'Digitel',            asn: 'AS21826', subnet: '186.168', rdns: 'dynamic-{ip}.digitel.com.ve',       tz: 'America/Caracas'     },
    '4141': { op: 'Digitel',            asn: 'AS21826', subnet: '186.169', rdns: 'dynamic-{ip}.digitel.com.ve',       tz: 'America/Caracas'     },
    '4160': { op: 'Movilnet',           asn: 'AS27889', subnet: '200.44',  rdns: '{ip}.movilnet.com.ve',              tz: 'America/Caracas'     },
    '4165': { op: 'Movilnet',           asn: 'AS27889', subnet: '200.45',  rdns: '{ip}.movilnet.com.ve',              tz: 'America/Caracas'     },

    // ── PERÚ (51) ──────────────────────────────────────
    '9510': { op: 'Movistar Perú',      asn: 'AS6147',  subnet: '190.232', rdns: '{ip}.mobile.telefonica.net.pe',     tz: 'America/Lima'        },
    '9511': { op: 'Movistar Perú',      asn: 'AS6147',  subnet: '190.233', rdns: '{ip}.mobile.telefonica.net.pe',     tz: 'America/Lima'        },
    '9900': { op: 'Claro Perú',         asn: 'AS27843', subnet: '181.65',  rdns: 'mobile-{ip}.claro.net.pe',          tz: 'America/Lima'        },
    '9901': { op: 'Claro Perú',         asn: 'AS27843', subnet: '181.176', rdns: 'mobile-{ip}.claro.net.pe',          tz: 'America/Lima'        },
    '9760': { op: 'Entel Perú',         asn: 'AS61468', subnet: '200.60',  rdns: '{ip}.entel.pe',                     tz: 'America/Lima'        },
    '9740': { op: 'Bitel',              asn: 'AS267613',subnet: '181.176', rdns: '{ip}.bitel.com.pe',                 tz: 'America/Lima'        },

    // ── ARGENTINA (54) ─────────────────────────────────
    '911':  { op: 'Personal',           asn: 'AS22927', subnet: '181.10',  rdns: '{ip}.gprs.personal.com.ar',         tz: 'America/Argentina/Buenos_Aires' },
    '9111': { op: 'Personal',           asn: 'AS22927', subnet: '181.11',  rdns: '{ip}.gprs.personal.com.ar',         tz: 'America/Argentina/Buenos_Aires' },
    '9150': { op: 'Claro Argentina',    asn: 'AS27747', subnet: '190.191', rdns: 'mobile-{ip}.claro.net.ar',          tz: 'America/Argentina/Buenos_Aires' },
    '9151': { op: 'Claro Argentina',    asn: 'AS27747', subnet: '190.192', rdns: 'mobile-{ip}.claro.net.ar',          tz: 'America/Argentina/Buenos_Aires' },
    '9160': { op: 'Movistar Argentina', asn: 'AS22084', subnet: '200.49',  rdns: '{ip}.mobile.movistar.net.ar',       tz: 'America/Argentina/Buenos_Aires' },
    '9161': { op: 'Movistar Argentina', asn: 'AS22084', subnet: '200.50',  rdns: '{ip}.mobile.movistar.net.ar',       tz: 'America/Argentina/Buenos_Aires' },

    // ── CHILE (56) ─────────────────────────────────────
    '9':  { op: 'Entel Chile',          asn: 'AS22047', subnet: '190.98',  rdns: '{ip}.dynamic.entel.cl',             tz: 'America/Santiago'    },
    '98': { op: 'Movistar Chile',       asn: 'AS27651', subnet: '181.43',  rdns: '{ip}.mobile.movistar.cl',           tz: 'America/Santiago'    },
    '99': { op: 'Claro Chile',          asn: 'AS27882', subnet: '200.72',  rdns: 'mobile-{ip}.claro.cl',              tz: 'America/Santiago'    },
    '97': { op: 'WOM Chile',            asn: 'AS263702',subnet: '190.248', rdns: '{ip}.wom.cl',                       tz: 'America/Santiago'    },
    '96': { op: 'VTR Móvil',            asn: 'AS263702',subnet: '200.72',  rdns: '{ip}.vtr.net',                      tz: 'America/Santiago'    },

    // ── BRASIL (55) ────────────────────────────────────
    '119': { op: 'Vivo',                asn: 'AS26615', subnet: '177.8',   rdns: '{ip}.dynamic.vivo.com.br',          tz: 'America/Sao_Paulo'   },
    '118': { op: 'Claro Brasil',        asn: 'AS28573', subnet: '177.66',  rdns: 'mobile-{ip}.claro.com.br',          tz: 'America/Sao_Paulo'   },
    '117': { op: 'TIM Brasil',          asn: 'AS26599', subnet: '187.0',   rdns: '{ip}.tim.com.br',                   tz: 'America/Sao_Paulo'   },
    '116': { op: 'Oi',                  asn: 'AS7738',  subnet: '200.147', rdns: '{ip}.oi.net.br',                    tz: 'America/Sao_Paulo'   },

    // ── ESPAÑA (34) ────────────────────────────────────
    '6':  { op: 'Movistar España',      asn: 'AS3352',  subnet: '81.33',   rdns: '{ip}.mobile.movistar.net',          tz: 'Europe/Madrid'       },
    '61': { op: 'Vodafone España',      asn: 'AS12430', subnet: '88.6',    rdns: '{ip}.dynamic.vodafone.es',          tz: 'Europe/Madrid'       },
    '62': { op: 'Orange España',        asn: 'AS12479', subnet: '90.168',  rdns: '{ip}.orange.es',                    tz: 'Europe/Madrid'       },
    '63': { op: 'MásMóvil',             asn: 'AS57269', subnet: '217.127', rdns: '{ip}.masmovil.es',                  tz: 'Europe/Madrid'       },
    '65': { op: 'Jazztel',              asn: 'AS57269', subnet: '83.165',  rdns: '{ip}.jazztel.es',                   tz: 'Europe/Madrid'       },

    // ── ESTADOS UNIDOS (1) ─────────────────────────────
    '201': { op: 'AT&T',                asn: 'AS7018',  subnet: '72.229',  rdns: '{ip}.sbcglobal.net',                tz: 'America/New_York'    },
    '202': { op: 'Verizon',             asn: 'AS701',   subnet: '174.205', rdns: '{ip}.vzwentp.net',                  tz: 'America/New_York'    },
    '212': { op: 'T-Mobile',            asn: 'AS21928', subnet: '104.28',  rdns: '{ip}.tmo.net',                      tz: 'America/New_York'    },
    '213': { op: 'Comcast',             asn: 'AS7922',  subnet: '76.89',   rdns: '{ip}.dynamic.comcast.net',          tz: 'America/Los_Angeles' },
    '305': { op: 'Spectrum',            asn: 'AS7922',  subnet: '72.229',  rdns: '{ip}.dynamic.spectrum.net',         tz: 'America/New_York'    },

    // ── REINO UNIDO (44) ───────────────────────────────
    '74': { op: 'EE',                   asn: 'AS12576', subnet: '86.3',    rdns: '{ip}.mobile.ee.co.uk',              tz: 'Europe/London'       },
    '75': { op: 'O2 UK',                asn: 'AS13285', subnet: '90.218',  rdns: '{ip}.o2mobile.co.uk',               tz: 'Europe/London'       },
    '77': { op: 'Vodafone UK',          asn: 'AS1273',  subnet: '82.44',   rdns: '{ip}.dynamic.vodafone.co.uk',       tz: 'Europe/London'       },
    '78': { op: 'Three UK',             asn: 'AS31655', subnet: '109.145', rdns: '{ip}.three.co.uk',                  tz: 'Europe/London'       },
    '79': { op: 'Sky Mobile',           asn: 'AS12576', subnet: '86.3',    rdns: '{ip}.sky.com',                      tz: 'Europe/London'       },
}

// Fallback por código de país
const COUNTRY_FALLBACK = {
    '57': { op: 'Claro Colombia',    asn: 'AS13489',  subnet: '181.49',  rdns: 'mobile-{ip}.claro.net.co',    tz: 'America/Bogota'                 },
    '52': { op: 'Telcel',            asn: 'AS8151',   subnet: '187.141', rdns: '{ip}.mobile.telcel.com',      tz: 'America/Mexico_City'            },
    '58': { op: 'Movistar Venezuela',asn: 'AS6306',   subnet: '190.202', rdns: '{ip}.movistar.net.ve',        tz: 'America/Caracas'                },
    '51': { op: 'Claro Perú',        asn: 'AS27843',  subnet: '181.65',  rdns: 'mobile-{ip}.claro.net.pe',   tz: 'America/Lima'                   },
    '54': { op: 'Personal',          asn: 'AS22927',  subnet: '181.10',  rdns: '{ip}.gprs.personal.com.ar',  tz: 'America/Argentina/Buenos_Aires' },
    '56': { op: 'Entel Chile',       asn: 'AS22047',  subnet: '190.98',  rdns: '{ip}.dynamic.entel.cl',      tz: 'America/Santiago'               },
    '55': { op: 'Vivo',              asn: 'AS26615',  subnet: '177.8',   rdns: '{ip}.dynamic.vivo.com.br',   tz: 'America/Sao_Paulo'              },
    '34': { op: 'Movistar España',   asn: 'AS3352',   subnet: '81.33',   rdns: '{ip}.mobile.movistar.net',   tz: 'Europe/Madrid'                  },
    '1':  { op: 'AT&T',              asn: 'AS7018',   subnet: '72.229',  rdns: '{ip}.sbcglobal.net',          tz: 'America/New_York'               },
    '44': { op: 'EE',                asn: 'AS12576',  subnet: '86.3',    rdns: '{ip}.mobile.ee.co.uk',        tz: 'Europe/London'                  },
}

const FAKE_MESSAGES = [
    ['❤️ te extraño mucho bb', 'cuando nos vemos?', 'jajaja eres un loco'],
    ['bro pasame la tarea', 'ya vi el partido, fue una locura', 'oye llámame cuando puedas'],
    ['ya llegué a casa', 'qué vas a hacer hoy?', 'me mandas el número de juan?'],
    ['happy birthday!! 🎂', 'ven a la fiesta el sábado', 'oye vi tu historia jajaj'],
    ['no te creo nada', 'en serio te lo juro', 'bueno ya te cuento después'],
]

// ─── Helpers ─────────────────────────────────────────────────────
function ri(n) { return Math.floor(Math.random() * n) }
function pick(arr) { return arr[ri(arr.length)] }
function pad(n) { return String(n).padStart(2, '0') }

// Hora real del país usando su timezone
function getRealTime(tz) {
    try {
        const now = new Date()
        const str = now.toLocaleString('en-GB', {
            timeZone: tz,
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        })
        return `${str} (${tz.split('/').pop().replace('_', ' ')})`
    } catch {
        return `${pad(new Date().getUTCHours())}:${pad(new Date().getUTCMinutes())}:${pad(new Date().getUTCSeconds())} (UTC)`
    }
}

function generateIP(subnet) {
    const parts = subnet.split('.')
    while (parts.length < 4) parts.push(String(ri(253) + 1))
    parts[parts.length - 1] = String(ri(253) + 1)
    return parts.join('.')
}

function generateRdns(template, ip) {
    return template.replace('{ip}', ip.replace(/\./g, '-'))
}

function generateMAC() {
    const first = (ri(127) * 2).toString(16).padStart(2, '0').toUpperCase()
    const rest = [...Array(5)].map(() => ri(256).toString(16).padStart(2, '0').toUpperCase())
    return [first, ...rest].join(':')
}

function detectNetwork(phone) {
    // Intenta prefijos locales de 4 → 1 dígito (sin código de país)
    // Prueba con código de país 1, 2 y 3 dígitos
    for (const ccLen of [3, 2, 1]) {
        const cc    = phone.slice(0, ccLen)
        const local = phone.slice(ccLen)
        for (const len of [4, 3, 2, 1]) {
            const prefix = local.slice(0, len)
            if (OPERATOR_MAP[prefix]) return OPERATOR_MAP[prefix]
        }
        if (COUNTRY_FALLBACK[cc]) return COUNTRY_FALLBACK[cc]
    }
    return { op: 'Unknown ISP', asn: 'AS0000', subnet: '192.168.1', rdns: '{ip}.unknown.net', tz: 'UTC' }
}

// ─── Handler ─────────────────────────────────────────────────────
let handler = async (m, { conn }) => {
    await m.react('⌛')

    const target    = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
    const shortName = '@' + target.split('@')[0]
    const phone     = target.split('@')[0]

    const net      = detectNetwork(phone)
    const fakeIP   = generateIP(net.subnet)
    const rdns     = generateRdns(net.rdns, fakeIP)
    const fakeMAC  = generateMAC()
    const realTime = getRealTime(net.tz)
    const msgs     = pick(FAKE_MESSAGES)

    // País desde la timezone
    const country = net.tz.split('/').pop().replace(/_/g, ' ')

    const { key } = await conn.sendMessage(m.chat, { text: '⏳ Iniciando proceso...' }, { quoted: m })

    const steps = [
        `💻 Iniciando intrusión contra ${shortName}...`,
        `📡 Número detectado: +${phone}`,
        `📶 Operador identificado: ${net.op}`,
        `🔌 ASN: ${net.asn}`,
        `🌐 Resolviendo IP en subred ${net.subnet}.0/16...`,
        `🔍 Escaneando puertos en ${fakeIP}...`,
        `🔐 Credenciales comprometidas...`,
        `💬 Interceptando mensajes recientes...`,
        `📤 Extrayendo datos...`,
        `🧹 Limpiando rastros...`,
        `✅ Acceso total obtenido`
    ]

    for (let i = 0; i < steps.length; i++) {
        const progress = Math.floor(((i + 1) / steps.length) * 100)
        const filled   = Math.floor(progress / 10)
        const bar      = '▰'.repeat(filled) + '▱'.repeat(10 - filled)
        await conn.sendMessage(m.chat, {
            text: `${steps[i]}\n\n[${bar}] ${progress}%`,
            edit: key
        })
        await new Promise(r => setTimeout(r, 900 + ri(600)))
    }

    const final =
        `☠️ *HACK COMPLETADO — REPORTE FINAL*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Objetivo:* ${shortName}\n` +
        `📱 *Número:* +${phone}\n\n` +
        `🌍 *UBICACIÓN*\n` +
        `• País: ${country}\n` +
        `• Zona horaria: ${net.tz}\n\n` +
        `🌐 *RED*\n` +
        `• Operador: ${net.op}\n` +
        `• Tipo de línea: mobile\n` +
        `• ASN: ${net.asn}\n` +
        `• IP pública: ${fakeIP}\n` +
        `• Hostname: ${rdns}\n` +
        `• MAC: ${fakeMAC}\n\n` +
        `🔑 *ÚLTIMA ACTIVIDAD*\n` +
        `• Hora local del objetivo: ${realTime}\n\n` +
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
