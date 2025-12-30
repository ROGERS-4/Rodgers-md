const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const readline = require("readline");
const fs = require("fs");

let pairingAsked = false; // ✅ prevents loop

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  // ✅ ASK FOR NUMBER ONLY ONCE
  if (!state.creds.registered && !pairingAsked) {
    pairingAsked = true;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("📲 Enter your WhatsApp number (2547xxxxxxx): ", async (number) => {
      try {
        const code = await sock.requestPairingCode(number.trim());
        console.log("\n🔗 PAIR CODE:", code);
        console.log("📌 Open WhatsApp → Linked Devices → Link with code\n");
      } catch (e) {
        console.log("❌ Failed to generate pair code:", e.message);
      }
      rl.close();
    });
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ RODGERS MD CONNECTED SUCCESSFULLY");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Delete auth folder and restart.");
      }
    }
  });
}

startBot();
