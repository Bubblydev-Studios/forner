const http = require('http')

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Bot is running')
}).listen(process.env.PORT || 3000)


const mineflayer = require('mineflayer')

const config = {
  host: 'VoidedSMP.aternos.me',
  port: 38491,
  username: 'AFK_Bot',
  reconnectDelay: 5000
}

let bot = null

function createBot() {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username
  })

  bot.on('spawn', () => {
    console.log('[+] Bot joined server')

    // simple anti-AFK movement
    setInterval(() => {
      if (!bot || !bot.entity) return
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 300)
    }, 8000)
  })

  bot.on('kicked', (reason) => {
    console.log('[!] Kicked:', reason?.toString())
  })

  bot.on('error', (err) => {
    console.log('[!] Error:', err.message)
  })

  bot.on('end', () => {
    console.log('[x] Disconnected. Reconnecting in', config.reconnectDelay / 1000, 's...')
    setTimeout(createBot, config.reconnectDelay)
  })
}

// start first connection
createBot()
