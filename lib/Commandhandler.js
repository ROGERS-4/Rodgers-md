const menu = require("./menu");
const { toggle } = require("./settings");
const config = require("../config");
const commands = require("../commands/commands.json");
const { getUptime } = require("./utils");
const { startStatusReact } = require("./autostatus");

module.exports = async ({ sock, msg, command, args, startTime }) => {
  const sender = msg.key.remoteJid;
  const user = msg.pushName || "User";

  if (!commands[command]) return;

  if (commands[command].ownerOnly && !config.owner.includes(sender.replace(/\D/g,""))) {
    return sock.sendMessage(sender, { text: "❌ You are not the owner!" });
  }

  if (command === "menu") return sock.sendMessage(sender, { text: menu(user, startTime) });

  // SYSTEM
  if (command === "ping") return sock.sendMessage(sender, { text: "🏓 Pong!" });
  if (command === "alive") return sock.sendMessage(sender, { text: "✅ I am alive!" });
  if (command === "uptime") return sock.sendMessage(sender, { text: `⏱ Uptime: ${getUptime(startTime)}` });
  if (command === "runtime") return sock.sendMessage(sender, { text: `⏱ Runtime: ${getUptime(startTime)}` });
  if (command === "botinfo") return sock.sendMessage(sender, { text: `🤖 Bot Name: ${config.botName}\n🔗 Channel: ${config.channel}` });

  // AUTOMATION
  if (["autoread","autostatusview","chatbot"].includes(command)) {
    const state = toggle(command);
    return sock.sendMessage(sender, { text: `⚙ ${command} is now ${state ? "ON" : "OFF"}` });
  }
  if (command === "autostatusreact") {
    startStatusReact(sock);
    return sock.sendMessage(sender, { text: "⚙ autostatusreact is now ACTIVE" });
  }

  // GROUP placeholders
  if (["tagall","hidetag","groupinfo","admins","welcome","goodbye"].includes(command)) {
    return sock.sendMessage(sender, { text: `✅ ${command} executed (placeholder)` });
  }

  // FUN
  if (command === "say") return sock.sendMessage(sender, { text: args.join(" ") || "Nothing to say!" });
  if (command === "time") return sock.sendMessage(sender, { text: `⏰ Current time: ${new Date().toLocaleTimeString("en-KE")}` });
  if (command === "date") return sock.sendMessage(sender, { text: `📅 Today: ${new Date().toLocaleDateString("en-KE")}` });
  if (command === "quote") return sock.sendMessage(sender, { text: "💬 Be yourself; everyone else is already taken." });
  if (command === "fact") return sock.sendMessage(sender, { text: "🌟 Did you know? Honey never spoils." });

  // OWNER
  if (command === "owner") return sock.sendMessage(sender, { text: `👑 Owner: ${config.owner.join(", ")}` });
  if (command === "restart") return sock.sendMessage(sender, { text: "🔄 Restarting..." });
  if (command === "shutdown") return sock.sendMessage(sender, { text: "⛔ Shutting down..." });
  if (command === "settings") return sock.sendMessage(sender, { text: "⚙ Bot settings menu" });
  if (command === "setprefix") return sock.sendMessage(sender, { text: `✅ Prefixes: ${config.prefixes.join(" ")}` });
};
