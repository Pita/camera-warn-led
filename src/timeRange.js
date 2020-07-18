const os = require("os");

const systemStartTime = new Date(Date.now() - os.uptime() * 1000);

module.exports = (line) => {
  if (!line.startsWith(20)) {
    return false;
  }

  const date = new Date(line.substr(0, 25));
  if (isNaN(date) || date < systemStartTime) {
    return false;
  }

  return true;
};
