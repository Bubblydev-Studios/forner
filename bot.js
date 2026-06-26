const http = require('http');
const mineflayer = require('mineflayer');

const PORT = process.env.PORT || 3000;

// Render health check
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft AFK Bot is running!');
}).listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

const config = {
  host: 'VoidedSMP.aternos.me',
  port: 38491,
  username: 'AFK_Bot',
  reconnectDelay: 5000
};

let bot;

function createBot() {
  console.log("Connecting...");

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username
  });

  bot.once('spawn', () => {
    console.log("[+] Bot joined server!");

    setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.setControlState('jump', true);
      setTimeout(() => {
        if (bot) bot.setControlState('jump', false);
      }, 300);
    }, 8000);
  });

  bot.on('login', () => console.log("[+] Logged in"));
  bot.on('messagestr', msg => console.log("[CHAT]", msg));
  bot.on('kicked', reason => console.log("[!] Kicked:", reason));
  bot.on('error', err => console.log("[!] Error:", err.message));

  bot.on('end', () => {
    console.log(`[x] Disconnected. Reconnecting in ${config.reconnectDelay / 1000}s...`);
    setTimeout(createBot, config.reconnectDelay);
  });
}

createBot();
