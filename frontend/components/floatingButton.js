import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function FloatingButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is authenticated
  const [isChatOpen, setIsChatOpen] = useState(false); // Track chat window visibility
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(''); // User's typed message
  const [loading, setLoading] = useState(false); // Loading state for message sending
  const [errorMessage, setErrorMessage] = useState(''); // Store error message

  useEffect(() => {
    // Check if the user is authenticated
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/session', {
          withCredentials: true, // Ensure cookies are sent for authentication
        });

        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false); // Ensure only authenticated users can interact with chat
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat window visibility
  };

  const sendMessage = async () => {
    // Ensure message is valid before proceeding
    if (!newMessage || newMessage.trim() === '') {
      setErrorMessage('Message cannot be empty.');
      return; // Return early if the message is empty
    }

    setMessages([...messages, { user: 'You', text: newMessage }]); // Add user's message
    setNewMessage(''); // Reset message input
    setLoading(true); // Set loading state while waiting for response

    try {
      const response = await axios.post(
        'http://localhost:5001/api/chat',
        { message: newMessage },
        { withCredentials: true } // Ensure session-based authentication
      );

      // Add AI's response to the chat
      const aiMessage = { user: 'AI', text: response.data.message };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  if (!isLoggedIn) return null; // Prevent chat window from rendering if not authenticated

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={toggleChat}>
        <Text style={styles.buttonText}>💬</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      {isChatOpen && (
        <View style={styles.chatModal}>
          <ScrollView style={styles.chatHistory}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <View key={index} style={styles.messageBubble}>
                  <Text>
                    {msg.user}: {msg.text || 'No text content'}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No messages yet.</Text>
            )}
          </ScrollView>

          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
          />
          <Button title="Send" onPress={sendMessage} disabled={loading} />

          {loading && <Text>Sending message...</Text>}
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity style={styles.closeButton} onPress={toggleChat}>
            <Text style={styles.closeText}>Close Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  chatModal: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 1000, // Ensure it's on top of other UI elements
  },
  chatHistory: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 4,
  },
  closeButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});