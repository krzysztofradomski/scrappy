const log = (...args) =>
  console.log("\033[33m\x1b[40mSCRAPPY LOG:\033[0m", ...args);

module.exports = log;
