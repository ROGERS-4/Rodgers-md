const config = require("../config");

function startHeartbeat(sock, userNumber, pluginsCount = 30, mode = "public") {
  const sendMessage = () => {
    const message = `*RODGERS 𝐌𝐃 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃*\n\n` +
      `𝐏𝐫𝐞𝐟𝐢𝐱       : *[ ${config.prefixes[0]} ]*\n` +
      `𝐏𝐥𝐮𝐠𝐢𝐧𝐬      : *${pluginsCount}*\n` +
      `𝐌𝐨𝐝𝐞        : *${mode}*\n` +
      `𝐎𝐰𝐧𝐞𝐫       : *${userNumber}*\n` +
      `𝐓𝐮𝐭𝐨𝐫𝐢𝐚𝐥𝐬     : *coming soon*\n` +
      `𝐔𝐩𝐝𝐚𝐭𝐞𝐬      : *${config.channel}*\n\n` +
      `> *©𝟐𝟎𝟐5 RODGERS 𝐌𝐃 𝐕1*`;

    sock.sendMessage(userNumber, { text: message });
  };

  sendMessage();
  setInterval(sendMessage, 4*60*60*1000);
}

module.exports = { startHeartbeat };
