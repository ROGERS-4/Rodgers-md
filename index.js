const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const fs = require("fs");

// CONFIG
const BOT_NAME = "RODGERS MD";
const BOT_CHANNEL = "https://whatsapp.com/channel/0029VbBR3ib3LdQQlEG3vd1x";
const POWERED_BY = "Rodgers";
const PREFIXES = [".", "!", "¡"];
const ALIVE_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
let CUSTOM_STATUS_EMOJIS = ["🔥","💥","⚡"]; // User can edit

// READ SESSION JSON
let authState;
if (fs.existsSync("./auth/session.json")) {
  authState = { creds: JSON.parse(fs.readFileSync("./auth/session.json")) };
} else {
  console.log("❌ No session found. Paste your session JSON in ./auth/session.json");
  process.exit(1);
}

// COMMANDS LIST
const COMMANDS = {
  "system": ["ping", "alive", "uptime"],
  "automation": ["autoread", "autostatusview", "chatbot"],
  "group": ["tagall", "hidetag", "groupinfo", "groupname", "gcpic", "kickall", "promote", "demote"],
  "fun": ["quote", "fact", "say", "joke", "inspire", "meme", "paranoia"],
  "utility": ["imgsize", "resize", "currency", "volume", "trim", "amplify"],
  "downloader": ["play", "video", "instagram", "spotify", "tiktok"]
};

// HELPER: Flatten all commands for easy lookup
const ALL_COMMANDS = Object.values(COMMANDS).flat();

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

    if (!ALL_COMMANDS.includes(cmd)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Unknown command" });
    }

    // HANDLE COMMANDS
    switch(cmd) {
      // SYSTEM
      case "ping": return sock.sendMessage(msg.key.remoteJid, { text: "Pong 🏓" });
      case "alive": return sock.sendMessage(msg.key.remoteJid, { text: `${BOT_NAME} is online ✅` });
      case "uptime": return sock.sendMessage(msg.key.remoteJid, { text: process.uptime().toFixed(2) + "s" });

      // AUTOMATION
      case "autoread": return sock.sendMessage(msg.key.remoteJid, { text: "Auto-read toggled" });
      case "autostatusview": return sock.sendMessage(msg.key.remoteJid, { text: "Auto-status view toggled" });
      case "chatbot": return sock.sendMessage(msg.key.remoteJid, { text: "Chatbot is active" });

      // GROUP
      case "tagall": return sock.sendMessage(msg.key.remoteJid, { text: "Tagging all..." });
      case "hidetag": return sock.sendMessage(msg.key.remoteJid, { text: "Hidetag executed" });
      case "groupinfo": return sock.sendMessage(msg.key.remoteJid, { text: "Group info..." });
      case "groupname": return sock.sendMessage(msg.key.remoteJid, { text: "Group name command" });
      case "gcpic": return sock.sendMessage(msg.key.remoteJid, { text: "Group picture command" });
      case "kickall": return sock.sendMessage(msg.key.remoteJid, { text: "Kick all executed" });
      case "promote": return sock.sendMessage(msg.key.remoteJid, { text: "Promote user executed" });
      case "demote": return sock.sendMessage(msg.key.remoteJid, { text: "Demote user executed" });

      // FUN
      case "quote": return sock.sendMessage(msg.key.remoteJid, { text: "Inspirational quote!" });
      case "fact": return sock.sendMessage(msg.key.remoteJid, { text: "Random fact 🧠" });
      case "say": return sock.sendMessage(msg.key.remoteJid, { text: text.slice(cmd.length+2) });
      case "joke": return sock.sendMessage(msg.key.remoteJid, { text: "Funny joke 🤣" });
      case "inspire": return sock.sendMessage(msg.key.remoteJid, { text: "Stay motivated! 💪" });
      case "meme": return sock.sendMessage(msg.key.remoteJid, { text: "Random meme here 😎" });
      case "paranoia": return sock.sendMessage(msg.key.remoteJid, { text: "Are you paranoid? 👀" });

      // UTILITY
      case "imgsize": return sock.sendMessage(msg.key.remoteJid, { text: "Image resize executed" });
      case "resize": return sock.sendMessage(msg.key.remoteJid, { text: "Resize executed" });
      case "currency": return sock.sendMessage(msg.key.remoteJid, { text: "Currency conversion executed" });
      case "volume": return sock.sendMessage(msg.key.remoteJid, { text: "Volume adjusted" });
      case "trim": return sock.sendMessage(msg.key.remoteJid, { text: "Trim executed" });
      case "amplify": return sock.sendMessage(msg.key.remoteJid, { text: "Amplify executed" });

      // DOWNLOADER
      case "play": return sock.sendMessage(msg.key.remoteJid, { text: "Play command executed" });
      case "video": return sock.sendMessage(msg.key.remoteJid, { text: "Video download executed" });
      case "instagram": return sock.sendMessage(msg.key.remoteJid, { text: "Instagram download executed" });
      case "spotify": return sock.sendMessage(msg.key.remoteJid, { text: "Spotify download executed" });
      case "tiktok": return sock.sendMessage(msg.key.remoteJid, { text: "TikTok download executed" });

      default: return;
    }
  });

  // SEND ALIVE MESSAGE EVERY 4 HOURS
  async function sendAliveMessage() {
    // Send to owner only for demo, you can extend to all chats
    const ownerJid = "254755660053@s.whatsapp.net";
    await sock.sendMessage(ownerJid, {
      text: `*${BOT_NAME} CONNECTED*\n\n`+
            `Prefix: ${PREFIXES.join(", ")}\n`+
            `Plugins: 30\n`+
            `Mode: public/private\n`+
            `Owner: +254755660053\n`+
            `Tutorials: coming soon\n`+
            `Updates: ${BOT_CHANNEL}\n\n`+
            `> ©2025 ${BOT_NAME} V1`
    });
  }

  // AUTO-STATUS REACT
  setInterval(async () => {
    try {
      const emoji = CUSTOM_STATUS_EMOJIS[Math.floor(Math.random() * CUSTOM_STATUS_EMOJIS.length)];
      await sock.sendPresenceUpdate('composing', 'status@broadcast');
      await sock.sendMessage('status@broadcast', { text: emoji });
    } catch(e){ }
  }, 10 * 60 * 1000); // every 10 minutes

}

startBot();
