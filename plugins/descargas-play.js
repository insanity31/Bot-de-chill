const handler = async (m, { conn, text }) => {
    if (!text) return;

    await conn.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key }
    });

    const search = await ytSearchDirect(text);

    if (!search) {
        return await conn.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        });
    }

    const controller = new AbortController();

    Promise.any([
        method1(search.id, controller.signal),
        method2(search.id, controller.signal)
    ])
        .then(async url => {
            controller.abort();

            await Promise.all([
                conn.sendMessage(m.chat, {
                    react: { text: "✅", key: m.key }
                }),
                conn.sendMessage(
                    m.chat,
                    {
                        audio: { url },
                        mimetype: "audio/mpeg",
                        fileName: `${search.title}.mp3`
                    },
                    { quoted: m }
                )
            ]);
        })
        .catch(async () => {
            await conn.sendMessage(m.chat, {
                react: { text: "🚫", key: m.key }
            });
        });
}

handler.command = ["play", "ytv"]
handler.tags = ["downloader"]
handler.help = ["play <búsqueda>"]

export default handler