let handler = async (m, { conn }) => {
  try {
    // 💗 Reacción estilo Zero Two
    await conn.sendMessage(m.chat, {
      react: { text: '💗', key: m.key }
    });

    // 📞 Lista de creadores ordenada según lo solicitado
    const users = [
      { nombre: '♡ 𝓐𝓪𝓻𝓸𝓶 - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '573107400303' },
      { nombre: '♡ Duarte - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '573135180876' },
      { nombre: '♡ Carlos - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '5355699866' },
      { nombre: '♡ litlee - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '525911153853' },
      { nombre: '♡ Gura bot ofc - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '573133374132' },
      { nombre: '♡ Gabriel - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '51941658192' },
      { nombre: '♡ Yosua - 𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ♡', numero: '584242773183' }
    ];

    // 📇 Generar las vCards para cada usuario
    let vcards = users.map(user => {
      return `BEGIN:VCARD\nVERSION:3.0\nN:${user.nombre};;;\nFN:${user.nombre}\nTEL;type=CELL;type=VOICE;waid=${user.numero}:${user.numero}\nEND:VCARD`;
    });

    // 💬 Mensaje estilo anime actualizado
    let texto = `╭━━━〔 ♡ 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 ♡ 〕━━━⬣
┃ ❥ Aquí están mis creadores
┃ ❥ Puedes hablar con ellos si me necesitas
┃ ❥ No seas tímido... 💗
╰━━━━━━━━━━━━━━━━⬣`;

    // 📩 Enviar mensaje de texto
    await conn.sendMessage(m.chat, { text: texto }, { quoted: m });

    // 📇 Enviar lista de contactos múltiples
    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: 'Creadores',
        contacts: vcards.map(vcard => ({ vcard }))
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await m.reply('♡ Ocurrió un error... inténtalo otra vez');
  }
};

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
