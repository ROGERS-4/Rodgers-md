const { readJSON, writeJSON } = require("./utils");
const settingsPath = "./database/settings.json";

function toggle(key) {
  const settings = readJSON(settingsPath);
  settings[key] = !settings[key];
  writeJSON(settingsPath, settings);
  return settings[key];
}

module.exports = { toggle };
