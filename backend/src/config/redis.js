const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
