const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis'); // ✅ Correct for v8+
const { createClient } = require('redis');
const lusca = require('lusca');

const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());

// 🔹 Setup Redis client (ensuring connection before session initialization)
const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

(async () => {
  await redisClient.connect();
  console.log("✅ Connected to Redis");
})();

// 🔹 Configure session middleware with Redis
app.use(
  session({
    store: new RedisStore({
      client: redisClient, // ✅ Properly passes Redis client
      prefix: 'sess:', // Optional: Prefix for Redis session keys
      disableTouch: true, // Prevents session TTL reset on every request
    }),
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(lusca.csrf());

app.use(cors({
  origin: 'http://localhost:8081', // or your frontend URL
  credentials: true, // Allow sending cookies with requests
}));

// Define routes
app.use('/api', authRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api', chatRoutes); // Add the chat routes

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
