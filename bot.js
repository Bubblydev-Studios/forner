const http = require("http");
const mineflayer = require("mineflayer");

// HTTP server required by Render
const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("AFK Bot is running!");
}).listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

const config = {
  host: "VoidedSMP.aternos.me",
  port: 38491,
  username: "AFK_Bot",
  version: "1.21.8",
  auth: "offline",
  reconnectDelay: 5000
};

let bot;
let afkInterval;

function createBot() {
  console.log(`Connecting to ${config.host}:${config.port}...`);

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: config.auth
  });

  bot.once("login", () => {
    console.log("[+] Logged in");
  });

  bot.once("spawn", () => {
    console.log("[+] Bot joined the server!");

    if (afkInterval) clearInterval(afkInterval);

    afkInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.setControlState("jump", true);

      setTimeout(() => {
        if (bot) bot.setControlState("jump", false);
      }, 300);

      bot.look(
        bot.entity.yaw + 0.25,
        bot.entity.pitch,
        true
      );
    }, 10000);
  });

  bot.on("messagestr", (msg) => {
    console.log("[CHAT]", msg);
  });

  bot.on("kicked", (reason) => {
    console.log("[KICKED]", reason);
  });

  bot.on("error", (err) => {
    console.log("[ERROR]", err);
  });

  bot.on("end", () => {
    console.log(`[DISCONNECTED] Reconnecting in ${config.reconnectDelay / 1000}s...`);

    if (afkInterval) {
      clearInterval(afkInterval);
      afkInterval = null;
    }

    setTimeout(createBot, config.reconnectDelay);
  });
}

createBot();
