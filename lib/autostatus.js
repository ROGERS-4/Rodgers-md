const { readJSON } = require("./utils");

function startStatusReact(sock) {
  const settings = readJSON("./database/settings.json");
  if (!settings.autostatusreact) return;

  const emojis = settings.statusEmojis || ["🔥","💯","⭐"];

  setInterval(async () => {
    try {
      const chats = Object.keys(sock.presences || {});
      for (const jid of chats) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await sock.sendMessage(jid, { react: { text: emoji, key: { remoteJid: jid } } });
      }
    } catch (e) { console.log("Status react error:", e.message); }
  }, 10*60*1000);
}

module.exports = { startStatusReact };
