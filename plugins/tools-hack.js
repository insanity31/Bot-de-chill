// plugins/hack.js
let handler = async (m, { conn, text }) => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // Determinar objetivo: si hay mención la usamos, si escriben número lo intentamos, si no, el mismo sender
  let targetJid =
    (m.mentionedJid && m.mentionedJid[0]) ||
    (text && (() => {
      // si escribieron @1234 o un número
      const mentionMatch = text.match(/@?(\d{5,})/);
      if (mentionMatch) return (mentionMatch[1].includes('@') ? mentionMatch[1] : mentionMatch[1] + '@s.whatsapp.net');
      return null;
    })()) ||
    m.sender;

  if (!targetJid) targetJid = m.sender;
  const shortName = '@' + targetJid.split('@')[0];

  // Pasos simulados (puedes añadir/quitar pasos)
  const steps = [
    `💻 Iniciando operación contra ${shortName}...`,
    '🔌 Conectando a servidores remotos...',
    '📡 Rastreando IP pública...',
    '🔍 Escaneo rápido de puertos (simulado)...',
    '🔐 Fuerza bruta de credenciales (simulado)...',
    '📂 Accediendo a archivos personales (simulado)...',
    '📤 Descargando datos seleccionados...',
    '🧹 Limpiando evidencias temporales...',
    '✅ Operación simulada completada'
  ];

  // Mostrar pasos con barra de progreso
  for (let i = 0; i < steps.length; i++) {
    const progress = Math.floor(((i + 1) / steps.length) * 100);
    const full = Math.floor(progress / 10);
    const bar = '▰'.repeat(full) + '▱'.repeat(10 - full);
    await conn.reply(m.chat, `${steps[i]}\n\n[${bar}] ${progress}%`, m);
    await delay(1200 + Math.floor(Math.random() * 800)); // tiempo variable para más realismo
  }

  // Datos falsos y divertidos (aleatorios)
  const fakeIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const fakeEmail = `${shortName.replace('@', '')}.${Math.floor(Math.random() * 999)}@example.com`;
  const fakePass = `P@ssw0rd${Math.floor(Math.random() * 9999)}`;
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const mins = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const locations = ['Bogotá', 'Lima', 'Madrid', 'CDMX', 'Buenos Aires'];
  const fakeLocation = locations[Math.floor(Math.random() * locations.length)];
  const final = 
`⚠️ *SIMULACIÓN COMPLETA*\n
Usuario: ${shortName}
IP: ${fakeIp}
Email: ${fakeEmail}
Password: ${fakePass}
Última conexión: ${hours}:${mins}
Ubicación aproximada: ${fakeLocation}

(Esto es un *prank*. No contiene instrucciones reales ni datos reales.)`;

  // Enviamos el resultado final mencionando al objetivo
  try {
    await conn.sendMessage(m.chat, { text: final, mentions: [targetJid] }, { quoted: m });
  } catch (e) {
    // Fallback si la API de sendMessage no acepta esa firma en tu versión
    await conn.reply(m.chat, final, m);
  }
};

handler.help = ['hack'];
handler.tags = ['fun'];
handler.command = ['hack'];
export default handler;