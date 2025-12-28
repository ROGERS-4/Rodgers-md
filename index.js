const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion } = require("@adiwajshing/baileys");
const P = require("pino");
const { state, saveState } = useSingleFileAuthState("./auth/creds.json");
const { config } = require("./config");
const { commandHandler } = require("./lib/commandHandler");
const { startHeartbeat } = require("./lib/heartbeat");

const startBot = async () => {
  const sock = makeWASocket({
    printQRInTerminal: true,
    logger: P({ level: "silent" }),
    auth: state
  });

  sock.ev.on("creds.update", saveState);

  const startTime = Date.now();

  // Heartbeat every 4 hours
  startHeartbeat(sock, config.owner[0]);

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if(!msg.message) return;
    let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if(!text) return;

    const prefix = config.prefixes.find(p => text.startsWith(p));
    if(!prefix) return;

    const [command, ...args] = text.slice(prefix.length).trim().split(/\s+/);

    commandHandler({ sock, msg, command, args, startTime });
  });
};

startBot();
