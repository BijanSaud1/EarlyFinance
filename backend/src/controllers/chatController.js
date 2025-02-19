const { getChatResponse } = require('../utils/openAI'); // Import the OpenAI helper

const ChatController = {
  // Handle sending message and receiving response
  async handleChat(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    const { message } = req.body; // Get the user message from the request body

    try {
      // Get the response from OpenAI
      const aiResponse = await getChatResponse(message);

      // Return the response to the frontend
      res.json({ message: aiResponse });
    } catch (error) {
      res.status(500).json({ message: 'Error processing the message with OpenAI', error: error.message });
    }
  },
};

module.exports = ChatController;
