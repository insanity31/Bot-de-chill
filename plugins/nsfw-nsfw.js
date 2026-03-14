import axios from 'axios';
import { database } from '../lib/database.js'

const API_MAP = {
  'neko': 'https://api.waifu.pics/nsfw/neko',
  'trap': 'https://api.waifu.pics/nsfw/trap',
  'blowjob': 'https://api.waifu.pics/nsfw/blowjob',
  'hentai': 'https://api.waifu.im/search?is_nsfw=true&included_tags=hentai',
  'ero': 'https://api.waifu.im/search?is_nsfw=true&included_tags=ero',
  'ass': 'https://api.waifu.im/search?is_nsfw=true&included_tags=ass',
  'paizuri': 'https://api.waifu.im/search?is_nsfw=true&included_tags=paizuri',
  'oral': 'https://api.waifu.im/search?is_nsfw=true&included_tags=oral',
  'milf': 'https://api.waifu.im/search?is_nsfw=true&included_tags=milf',
  'ecchi': 'https://api.waifu.im/search?is_nsfw=true&included_tags=ecchi',
  'tetas': 'https://nekobot.xyz/api/image?type=boobs',
  'pechos': 'https://nekobot.xyz/api/image?type=boobs',
  'pussy': 'https://nekobot.xyz/api/image?type=pussy',
  'culo': 'https://nekobot.xyz/api/image?type=ass',
  'gonewild': 'https://nekobot.xyz/api/image?type=gonewild',
  '4k': 'https://nekobot.xyz/api/image?type=4k'
};

let handler = async (m, { conn, command }) => {
  if (!database.data.groups?.[m.chat]?.nsfw) {
    return m.reply('🚫 El contenido NSFW está desactivado.\n> Ve a jalartela a otro lado 😡');
  }

  const apiUrl = API_MAP[command];
  if (!apiUrl) return;

  try {
    await m.react('🕑');
    const { data } = await axios.get(apiUrl);
    const imageUrl = data.url || data.message || (data.images && data.images[0]?.url);

    if (!imageUrl) throw new Error();

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `🥵 *${command.toUpperCase()}*\n> No te la jales 😏`
    }, { quoted: m });

    await m.react('✅');
  } catch {
    await m.react('✖️');
    m.reply('❌ Error al obtener contenido.');
  }
};

handler.help = handler.command = Object.keys(API_MAP);
handler.tags = ['nsfw'];
handler.group = true;

export default handler;
