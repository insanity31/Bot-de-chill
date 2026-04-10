import './settings.js'
import chalk from 'chalk'
import print  from './lib/print.js'
import { smsg }     from './lib/simple.js'
import { database } from './lib/database.js'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { pathToFileURL } from 'url'
import { jidNormalizedUser } from '@whiskeysockets/baileys'

const toNum = v => (v + '').replace(/[^0-9]/g, '')
const localPart = v => (v + '').split('@')[0].split(':')[0]
const numCore = v => toNum(localPart(v))

function normalizeJid(v) {
  if (!v) return ''
  v = String(v).trim()
  if (v.startsWith('@')) v = v.slice(1)
  if (v.endsWith('@g.us')) return v
  if (v.endsWith('@lid'))  return v
  const n = toNum(v.split('@')[0])
  return n ? `${n}@s.whatsapp.net` : v
}

function stripDevice(jid = '') {
 return jid.replace(/:\d+(?=@)/, '')
}

const PREFIXES = global.prefix //Puedes usar este ['#', '.', '/', '$'] si deseas más prefijos

function getPrefix(body = '') {
  for (const p of PREFIXES) {
    if (body.startsWith(p)) return p
  }
  return null
}


function pickOwners() {
  const arr = Array.isArray(global.owner) ? global.owner : []
  return arr.map(v => {
    if (Array.isArray(v)) return { num: numCore(v[0]), root: !!v[2] }
    return { num: numCore(v), root: false }
  })
}

const isOwnerJid = jid => pickOwners().some(o => o.num === numCore(jid))
const isRootOwner = jid => pickOwners().some(o => o.num === numCore(jid) && o.root)

function isPremiumJid(jid) {
  const num   = numCore(jid)
  const prems = Array.isArray(global.prems) ? global.prems.map(numCore) : []
  if (prems.includes(num)) return true
  return !!database.data?.users?.[normalizeJid(jid)]?.premium
}


function similarity(a, b) {
  let matches = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++
  }
  return Math.floor((matches / Math.max(a.length, b.length)) * 100)
}

function getSuggestions(commandName, plugins) {
  const all = []
  for (const [, plugin] of plugins) {
    if (!plugin.command) continue
    const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
    for (const c of cmds) {
      if (typeof c === 'string') all.push(c)
    }
  }
  return all
    .map(c => ({ cmd: c, score: similarity(commandName, c) }))
    .filter(o => o.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}


function classifyError(e) {
  const msg = e?.message || String(e)
  if (e?.response)                                                    return `API/HTTP ${e.response?.status || ''}`
  if (msg.includes('<html') || msg.includes('<!DOCTYPE'))             return 'HTML inesperado (API caída)'
  if (msg.includes('Unexpected token') || msg.includes('JSON'))       return 'Error de JSON'
  if (msg.includes('Cannot find module') || msg.includes('ERR_MODULE_NOT_FOUND')) return 'Módulo no encontrado'
  if (msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND'))      return 'Sin conexión / API caída'
  if (msg.includes('timeout') || msg.includes('ETIMEDOUT'))           return 'Timeout'
  if (msg.includes('Cannot read propert'))                            return 'TypeError: propiedad undefined'
  return 'Desconocido'
}

const _groupCache = new Map()

async function getGroupMeta(conn, chatId) {
  const cached = _groupCache.get(chatId)
  if (cached && Date.now() - cached.ts < 30_000) return cached.meta
  try {
    const meta = await conn.groupMetadata(chatId)
    _groupCache.set(chatId, { meta, ts: Date.now() })
    return meta
  } catch {
    return null
  }
}

function buildParticipantMap(participants = []) {
  const map = new Map()
  for (const p of participants) {
    const raw = p.jid || p.id || ''
    if (!raw) continue
    const clean  = stripDevice(raw)
    const normed = normalizeJid(clean)
    const num    = numCore(raw)

    for (const key of [raw, clean, normed, num].filter(Boolean)) {
      if (!map.has(key)) map.set(key, p)
    }
  }
  return map
}

function findParticipant(map, jid) {
  const clean  = stripDevice(jid)
  const normed = normalizeJid(clean)
  const num = numCore(jid)
  return map.get(jid) || map.get(clean) || map.get(normed) || map.get(num) || null
}

async function resolveLid(conn, chatId, lidOrJid) {
  if (!lidOrJid) return null

  if (!lidOrJid.endsWith('@lid') && numCore(lidOrJid).length <= 13) {
    return normalizeJid(lidOrJid)
  }
  try {
    const meta  = await getGroupMeta(conn, chatId)
    const parts = meta?.participants || []
    const raw   = localPart(lidOrJid)

    const found = parts.find(p => {
      const pid = localPart(p.jid || p.id || '')
      return pid === raw
    })
    if (found) {
      const jid = found.jid || found.id || ''
      return stripDevice(jid) || normalizeJid(jid)
    }
  } catch {}
  return lidOrJid  
}

const _loadedSockets = new WeakSet()

export async function loadEvents(conn) {
  if (!conn?.ev?.on) return
  if (_loadedSockets.has(conn)) return
  _loadedSockets.add(conn)

  const eventsPath = resolve('./events')
  let files = []
  try {
    files = readdirSync(eventsPath).filter(f => f.endsWith('.js'))
  } catch {
    console.log(chalk.yellow('  · [events] Carpeta ./events no encontrada, omitiendo.'))
    return
  }

  for (const file of files) {
    try {
      const mod = await import(pathToFileURL(join(eventsPath, file)).href)
      if (!mod.event || !mod.run) {
        console.log(chalk.yellow(`  · [events] ${file}: falta 'event' o 'run', saltando.`))
        continue
      }
      conn.ev.on(mod.event, data => {
        const id = data?.id || data?.key?.remoteJid || null
        if (mod.enabled && id && !mod.enabled(id)) return
        mod.run(conn, data)
      })
      console.log(chalk.green(`  ✦ [events] ${file} → ${mod.event}`))
    } catch (e) {
      console.log(chalk.red(`  ✗ [events] ${file}:`), e.message)
    }
  }
}

export async function handler(m, conn, plugins) {
  try {
    if (!m) return

    loadEvents(conn).catch(() => {})

    m = await smsg(conn, m)
    if (!m) return

    if (m.isGroup) {
      const muted = database.data?.groups?.[m.chat]?.muted || []
      if (muted.includes(m.sender)) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {})
        return
      }
    }

    await print(m, conn).catch(() => {})

    if (!m.body) return

    const usedPrefix = getPrefix(m.body)
    if (!usedPrefix) return

    const withoutPrefix = m.body.slice(usedPrefix.length).trim()
    const parts = withoutPrefix.split(/\s+/)
    const command = (parts.shift() || '').toLowerCase()
    const args = parts
    const text = args.join(' ')

    if (!command) return

    let cmd = null

    if (usedPrefix === '$') {

      for (const [, plugin] of plugins) {
        if (plugin.customPrefix?.includes('$')) {
          cmd = plugin
          args.unshift(command)
          break
        }
      }
    } else {
      for (const [, plugin] of plugins) {
        if (!plugin.command) continue
        const cmds = Array.isArray(plugin.command)
          ? plugin.command
          : plugin.command instanceof RegExp
            ? []
            : [plugin.command]
        if (cmds.map(c => String(c).toLowerCase()).includes(command)) {
          cmd = plugin
          break
        }
      }
    }

    if (!cmd) {
      const suggestions = getSuggestions(command, plugins)
      const sugestText  = suggestions.length
        ? suggestions.map(s => `*${usedPrefix + s.cmd}* » ${s.score}%`).join('\n')
        : 'Sin sugerencias'

      return conn.sendMessage(m.chat, {
        text: [
          `❌ El comando *${usedPrefix + command}* no existe.`,
          `Usa *${usedPrefix}menu* para ver los comandos disponibles.`,
          ``,
          `*Comandos similares:*`,
          sugestText,
        ].join('\n'),
      }, { quoted: m })
    }

    const senderClean = stripDevice(m.sender || '')
    if (senderClean !== m.sender) {
      m.realSender = m.sender
      m.sender     = senderClean
    }

    const isROwner = isRootOwner(m.sender)
    const isOwner = isROwner || isOwnerJid(m.sender)
    const isPremium = isOwner  || isPremiumJid(m.sender)
    const isRegistered = isOwner  || !!(database.data?.users?.[m.sender]?.registered)

    // ── Metadata de grupo y participantes ─────────────────────────────────
    const isGroup = m.isGroup
    let groupMeta = null
    let participants = []
    let partMap = new Map()
    let isAdmin = false
    let isBotAdmin = false

    if (isGroup) {
      groupMeta = await getGroupMeta(conn, m.chat)
      participants = groupMeta?.participants || []
      partMap = buildParticipantMap(participants)

      // Sender en el grupo (soporta JID y LID)
      const senderP = findParticipant(partMap, m.sender)
      isAdmin = senderP?.admin === 'admin' || senderP?.admin === 'superadmin' || isOwner

      // Bot en el grupo
      const botRaw = conn.user?.id || conn.user?.jid || ''
      const botClean = stripDevice(botRaw)
      const botJid = normalizeJid(botClean)
      const botP = findParticipant(partMap, botJid)
      isBotAdmin = botP?.admin === 'admin' || botP?.admin === 'superadmin'
    }

    if (!database.data.users)  database.data.users  = {}
    if (!database.data.groups) database.data.groups = {}

    if (!database.data.users[m.sender]) {
      database.data.users[m.sender] = {
        registered: false,
        premium: false,
        banned: false,
        warning: 0,
        exp: 0,
        level: 1,
        limit: 20,
        lastclaim: 0,
        registered_time: 0,
        name: m.pushName || '',
        age: null,
      }
      database.save()
    } else if (!database.data.users[m.sender].name && m.pushName) {
      database.data.users[m.sender].name = m.pushName
    }

    if (isGroup && !database.data.groups[m.chat]) {
      database.data.groups[m.chat] = { modoadmin: false, muted: [] }
      database.save()
    }

    let who = null
    const rawWho = m.mentionedJid?.[0] || m.quoted?.sender || null

    if (rawWho) {
      who = await resolveLid(conn, m.chat, rawWho)
    }

    if (isGroup && database.data.groups[m.chat]?.modoadmin && !isAdmin && !isOwner) {
      return m.reply('🔒 *Modo Admin activo* — Solo los administradores pueden usar comandos.')
    }

    if (database.data.users[m.sender]?.banned && !isOwner) {
      return m.reply('🚫 Estás baneado del bot.')
    }

    if (cmd.rowner && !isROwner) return m.reply('👑 Solo el creador principal puede usar este comando.')
    if (cmd.owner && !isOwner) return m.reply('👑 Solo el propietario del bot puede usar este comando.')
    if (cmd.premium && !isPremium) return m.reply('💎 Este comando es exclusivo para usuarios *Premium*.')
    if (cmd.register && !isRegistered) {
      return m.reply(`📝 Debes registrarte primero.\n\n> Usa: *${usedPrefix}reg nombre.edad*\n> Ej: *${usedPrefix}reg Juan.25*`)
    }
    if (cmd.group && !isGroup) return m.reply('🏢 Este comando solo funciona en grupos.')
    if (cmd.admin && !isAdmin) return m.reply('👮 Solo administradores del grupo pueden usar este comando.')
    if (cmd.botAdmin && !isBotAdmin) return m.reply('🤖 Necesito ser administrador del grupo para hacer eso.')
    if (cmd.private && isGroup) return m.reply('💬 Escríbeme al privado para usar este comando.')

    // ── Sistema de límites ────────────────────────────────────────────────
    if (cmd.limit && !isPremium && !isOwner) {
      const userLimit = database.data.users[m.sender].limit || 0
      if (userLimit < 1) {
        return m.reply('⚠️ Se agotaron tus usos diarios.\n💎 Los usuarios premium tienen usos ilimitados.')
      }
      database.data.users[m.sender].limit -= 1
      database.save()
    }

    await cmd(m, {
      conn,
      args,
      text, // texto completo sin comando ni prefijo
      command, // nombre del comando (sin prefijo)
      usedPrefix, // prefijo usado (#, ., /, $)
      isOwner,
      isROwner,
      isPremium,
      isRegistered,
      isAdmin,
      isBotAdmin,
      isGroup,
      who, // JID del mencionado/citado (resuelto desde LID si era necesario)
      participants, // array de participantes del grupo
      groupMeta, // metadata completa del grupo
      db: database.data, // acceso directo a la DB
      prefix: usedPrefix, // alias de usedPrefix (compatibilidad)
      plugins,
    })

  } catch (e) {

    const type = classifyError(e)
    const msg  = e?.message || String(e)

    console.log(chalk.red('\n  ✗ [handler] Error:'), type)
    console.log(chalk.red(msg.slice(0, 500)))

    const userMsg = [
      `❌ *Error al ejecutar el comando*`,
      ``,
      `📌 *Tipo:* ${type}`,
      `🧾 *Detalle:*`,
      msg.slice(0, 400),
    ].join('\n')

    if (m?.reply) m.reply(userMsg).catch(() => {})
  }
}
