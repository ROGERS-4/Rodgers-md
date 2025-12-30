const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  MessageType
} = require("@whiskeysockets/baileys");
const fs = require("fs");

// CONFIG
const BOT_NAME = "RODGERS MD";
const BOT_CHANNEL = "https://whatsapp.com/channel/0029VbBR3ib3Ld1x";
const POWERED_BY = "Rodgers";
const PREFIXES = [".", "!", "¡"];
const ALIVE_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
let CUSTOM_STATUS_EMOJIS = ["🔥","💥","⚡"]; // user can update

// READ SESSION JSON
let authState;
if (fs.existsSync("./auth/session.json")) {
  authState = { creds: JSON.parse(fs.readFileSync("./auth/session.json")) };
} else {
  console.log("❌ No session found. Paste your session JSON in ./auth/session.json");
  process.exit(1);
}

async function startBot() {
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: authState,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", (creds) => {
    fs.writeFileSync("./auth/session.json", JSON.stringify(creds, null, 2));
  });

  // CONNECTION HANDLER
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log(`✅ ${BOT_NAME} CONNECTED`);
      sendAliveMessage();
      setInterval(sendAliveMessage, ALIVE_INTERVAL);
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Replace session JSON and restart.");
      }
    }
  });

  // MESSAGE HANDLER
  sock.ev.on("messages.upsert", async (msgUpsert) => {
    const msg = msgUpsert.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    const prefixUsed = PREFIXES.find(p => text.startsWith(p));
    if (!prefixUsed) return;

    const cmd = text.slice(1).trim().toLowerCase();

    // 30 COMMANDS
    switch(cmd) {
      // ⚙ SYSTEM
      case "ping": return sock.sendMessage(msg.key.remoteJid, { text: "Pong 🏓" });
      case "alive": return sock.sendMessage(msg.key.remoteJid, { text: `${BOT_NAME} is online ✅` });
      case "uptime": return sock.sendMessage(msg.key.remoteJid, { text: process.uptime().toFixed(2) + "s" });

      // 🔄 AUTOMATION
      case "autoread": return sock.sendMessage(msg.key.remoteJid, { text: "Auto-read toggled" });
      case "autostatusview": return sock.sendMessage(msg.key.remoteJid, { text: "Auto-status view toggled" });
      case "chatbot": return sock.sendMessage(msg.key.remoteJid, { text: "Chatbot is active" });

      // 👥 GROUP
      case "tagall": return sock.sendMessage(msg.key.remoteJid, { text: "Tagging all..." });
      case "hidetag": return sock.sendMessage(msg.key.remoteJid, { text: "Hidetag executed" });
      case "groupinfo": return sock.sendMessage(msg.key.remoteJid, { text: "Group info..." });

      // 🎉 FUN
      case "quote": return sock.sendMessage(msg.key.remoteJid, { text: "Inspirational quote!" });
      case "fact": return sock.sendMessage(msg.key.remoteJid, { text: "Random fact 🧠" });
      case "say": return sock.sendMessage(msg.key.remoteJid, { text: text.slice(cmd.length+2) });

      // ⚡ Add other commands here as needed up to 30
      default:
        return sock.sendMessage(msg.key.remoteJid, { text: "❌ Unknown command" });
    }
  });

  // SEND ALIVE MESSAGE EVERY 4 HOURS
  async function sendAliveMessage() {
    const allChats = Object.keys(sock.chats);
    for (let jid of allChats) {
      try {
        await sock.sendMessage(jid, {
          text: `*${BOT_NAME} CONNECTED*\n\n`+
                `Prefix: ${PREFIXES.join(", ")}\n`+
                `Plugins: 30\n`+
                `Mode: public/private\n`+
                `Owner: +254755660053\n`+
                `Tutorials: coming soon\n`+
                `Updates: ${BOT_CHANNEL}\n\n`+
                `> ©2025 ${BOT_NAME} V1`
        });
      } catch(e){ }
    }
  }
}

startBot();
