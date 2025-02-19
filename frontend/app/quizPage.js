import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/session', {
          withCredentials: true, // 🔹 Ensures session cookies are sent
        });

        if (!response.data.isAuthenticated) {
          console.log('❌ No session found. Redirecting to login.');
          router.push('/login'); // Redirect to login if session is not active
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/login'); // Redirect to login if session check fails
      }
    };

    checkSession();
  }, []);

  const fetchQuiz = async () => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/quiz/${topic}`, {
        withCredentials: true, // 🔹 Ensures session is validated on the backend
      });
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Quiz</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Topic"
        value={topic}
        onChangeText={setTopic}
      />
      <Button title="Generate Quiz" onPress={fetchQuiz} />
      {loading ? <Text style={styles.loading}>Loading...</Text> : null}
      {quiz ? <ScrollView><Text style={styles.quiz}>{quiz}</Text></ScrollView> : null}
    </View>
  );
}

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  loading: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  quiz: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
});
