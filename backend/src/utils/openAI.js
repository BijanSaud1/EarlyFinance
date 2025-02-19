// openAI.js

const { OpenAI } = require('openai');
const redisClient = require('../config/redis'); // Import Redis client

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
});

// Function to send a message to OpenAI and get a response
const getChatResponse = async (userId, message) => {
  // Ensure message is a valid string and not empty
  if (!message || typeof message !== 'string' || message.trim() === '') {
    console.error("Invalid message content: ", message);
    throw new Error("Message cannot be empty or invalid.");
  }

  console.log("Message received from user: ", message); // Log message before using it

  try {
    // Fetch the user's conversation history from Redis
    const conversationHistory = JSON.parse(await redisClient.get(`chat:${userId}`)) || [];

    // Add the new user message to the conversation history
    conversationHistory.push({ role: 'user', content: message });

    // Send the conversation history to OpenAI for context
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a financial tutor. Please provide short, clear, and concise answers. Avoid lengthy explanations and aim to respond with actionable advice.' },
        ...conversationHistory, // Add the conversation history to maintain context
      ],
    });

    const aiResponse = response.choices[0].message.content;

    // Add the AI's response to the conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });

    // Save updated conversation history back to Redis with a TTL of 24 hours
    await redisClient.set(`chat:${userId}`, JSON.stringify(conversationHistory), { EX: 86400 });

    // Return the AI's response
    return aiResponse;
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    throw error;
  }
};

module.exports = { getChatResponse };
