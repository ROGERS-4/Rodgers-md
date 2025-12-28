const config = require("../config");
const { getUptime } = require("./utils");

module.exports = (user, startTime) => `
👋 Hello, ${user}!

🤖 ${config.botName} IS ONLINE
⏱ Uptime: ${getUptime(startTime)}
🔑 Prefixes: ${config.prefixes.join("  ")}

━━━ COMMAND MENU ━━━

⚙ SYSTEM
• ping
• alive
• uptime
• runtime
• botinfo

🔄 AUTOMATION
• autoread
• autostatusview
• autostatusreact
• chatbot

👥 GROUP
• tagall
• hidetag
• groupinfo
• admins
• welcome
• goodbye

🎉 FUN
• menu
• time
• date
• quote
• fact
• say

━━━━━━━━━━━━━━━
Powered by Rodgers
🔗 ${config.channel}
`;
