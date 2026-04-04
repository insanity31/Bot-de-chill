import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';

const scriptPath = fileURLToPath(import.meta.url);

global.owner = [
    ['584244733684', ' insanity31'],
    ['573135180876', 'duartexv'],
    ['5493873655135', 'fargust la cabra']
];
global.mods = [];
global.suittag = [];
global.prems = [];

global.botNumber = '';

global.libreria = 'Baileys';
global.baileys = 'V 6.7.17';
global.vs = '1.0.0';
global.nameqr = '🎭 𝕀ℕ𝕊𝔸ℕ𝕀𝕋𝕐 🎭';
global.namebot = '𝕀ℕ𝕊𝔸ℕ𝕀𝕋𝕐 𝔹𝕆𝕋';
global.sessions = './Sessions/Owner';
global.jadi = 'JadiBots';

global.packname = 'Insanity Bot';
global.botname = 'Insanity Bot';
global.botName = 'Insanity Bot';
global.wm = '🎴 ɪɴꜱᴀɴɪᴛʏ ʙᴏᴛ 🎴';
global.author = '© ᴏᴛᴀᴋᴜ ᴄᴏᴍᴍᴜɴɪᴛʏ';
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳 ɪɴꜱᴀɴɪᴛʏ31';
global.textbot = '🎭 ʙɪᴇɴᴠᴇɴɪᴅᴏ a mi mundo, ᴘʀᴇᴘᴀʀᴀᴛᴇ ᴘᴀʀᴀ ʟᴀ ʟᴏᴄᴜʀᴀ 🎭';
global.etiqueta = 'insanitybot';

global.moneda = 'Stamps';
global.currencySymbol = 'Stamps';

global.welcom1 = '🎭 ¡Bienvenido a la cueva de los otakus locos! 🎭\n🎴 Prepárate para la locura total 🎴\n🗣️ Disfruta y causa caos 🔥\nEdita este mensaje con setwelcome';
global.welcom2 = '🥀 ¡Hasta la próxima, otaku loco! 🥀\n🗣️ La locura siempre te esperará 🔥\n🎭 ¡Vuelve pronto a desatar el caos! 🎭\nEdita este mensaje con setbye';

global.banner = 'https://adofiles.i11.eu/dl/3gl6.jpg';
global.bannerUrl = 'https://adofiles.i11.eu/dl/asvu.png';
global.avatar = 'https://adofiles.i11.eu/dl/v35m.png';
global.iconUrl = 'https://adofiles.i11.eu/dl/bju4.jpg';
global.catalogo = null;
global.catalogImage = null;

global.botVersion = '1.0.0';
global.botEmoji = '🎭';
global.emoji = '🎴';
global.emoji2 = '🗿';
global.emoji3 = '🔥';
global.emoji4 = '⚡';
global.emoji5 = '💢';
global.prefix = '.';

global.botText = '🎭 ɪɴꜱᴀɴɪᴛʏ ʙᴏᴛ 🎭 - ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏᴛᴀᴋᴜ ᴅᴇᴍᴏɴꜱ';
global.botTag = '🎭 ɪɴꜱᴀɴɪᴛʏ ʙᴏᴛ 🎭 | ʟᴏᴄᴜʀᴀ ᴏᴛᴀᴋᴜ';
global.devCredit = '© ɪɴꜱᴀɴɪᴛʏ ᴛᴇᴀᴍ';
global.authorCredit = '© ᴏᴛᴀᴋᴜ ᴄᴏᴍᴍᴜɴɪᴛʏ';

global.groupLink = 'https://chat.whatsapp.com/tu-link-grupo';
global.communityLink = 'https://chat.whatsapp.com/GPfABUmCuVN2Qu1d1PPcBY';
global.channelLink = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T';
global.gitHubRepo = 'https://github.com/insanity31/Bot-de-chill.git';
global.emailContact = 'Insanitybot@gmail.com';
global.correo = 'Insanitybot@gmail.com';

global.gp1 = global.groupLink;
global.comunidad1 = global.communityLink;
global.channel = global.channelLink;
global.md = global.gitHubRepo;

global.newsChannels = {
    primary: '120363401404146384@newsletter',
};

global.rcanal = {
    contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363401404146384@newsletter',
            serverMeId: 100,
            newsletterName: '🎭 ɪɴꜱᴀɴɪᴛʏ ʙᴏᴛ 🎭'
        }
    }
};

global.ch = {
    ch1: '120363401404146384@newsletter',
};

// API Configurations con la key completa de apicausas
global.apiConfigs = {
    apicausas: { 
        baseUrl: 'https://rest.apicausas.xyz', 
        key: 'causa-a59e3676643b28e7',
        extraKey: 'a59e3676643b28e7' 
    },
    stellar: { baseUrl: 'https://api.stellarwa.xyz', key: null },
    xyro: { baseUrl: 'https://api.xyro.site', key: null },
    yupra: { baseUrl: 'https://api.yupra.my.id', key: null },
    vreden: { baseUrl: 'https://api.vreden.web.id', key: null },
    delirius: { baseUrl: 'https://api.delirius.store', key: null },
    siputzx: { baseUrl: 'https://api.siputzx.my.id', key: null },
    nekolabs: { baseUrl: 'https://api.nekolabs.web.id', key: null },
    ootaizumi: { baseUrl: 'https://api.ootaizumi.web.id', key: null },
    apifaa: { baseUrl: 'https://api-faa.my.id', key: null },
};

// API principal con la key completa
global.api = {
    url: 'https://rest.apicausas.xyz',
    key: 'causa-a59e3676643b28e7'
};

global.APIs = {
    apicausas: 'https://rest.apicausas.xyz',
    stellar: 'https://api.stellarwa.xyz',
    xyro: 'https://api.xyro.site',
    yupra: 'https://api.yupra.my.id',
    vreden: 'https://api.vreden.web.id',
    delirius: 'https://api.delirius.store',
    siputzx: 'https://api.siputzx.my.id',
};

global.APIKeys = {
    'https://rest.apicausas.xyz': 'causa-a59e3676643b28e7',
};

global.multiplier = 60;

global.premiumUsers = [];
global.suitTags = [];

global.opts = {
    autoread: true,
    queque: false
};

// Crear carpetas necesarias
const directories = ['./Sessions', './Sessions/Owner', './Sessions/SubBots', './Sessions/Subs', global.jadi];
for (const dir of directories) {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(chalk.greenBright(`✅ Carpeta ${dir} creada.`));
        } catch (error) {
            console.error(chalk.redBright(`❌ Error al crear carpeta ${dir}:`, error.message));
        }
    }
}

console.log(chalk.greenBright("✅ settings.js cargado correctamente."));
console.log(chalk.cyanBright(`🎭 API Principal: ${global.api.url}`));
console.log(chalk.cyanBright(`🔑 API Key: ${global.api.key}`));

let file = scriptPath;
watchFile(file, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        unwatchFile(file);
        console.log(chalk.redBright("🔄 Update 'settings.js'"));
        import(`${file}?update=${Date.now()}`).catch(err => {
            console.error(chalk.redBright("❌ Error al recargar settings.js:", err));
        });
    }
});
