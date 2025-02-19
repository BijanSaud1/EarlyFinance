import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LessonPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
        });
        const data = await response.json();

        if (!data.isAuthenticated) {
          console.log('❌ No session found. Redirecting to login.');
          router.push('/'); // Redirect to login if no session
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/'); // Redirect if an error occurs
      }
    };

    checkSession();
  }, []);

  const handleStartLesson = () => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect to login if not authenticated
      return;
    }
    setIsStarted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Lessons</Text>

      {/* Static Lesson Card */}
      <View style={styles.lessonCard}>
        <Text style={styles.lessonTitle}>Budgeting Basics</Text>
        <Text style={styles.lessonDescription}>
          Learn the basics of budgeting and how to manage your finances effectively.
        </Text>
        {!isStarted ? (
          <TouchableOpacity style={styles.button} onPress={handleStartLesson}>
            <Text style={styles.buttonText}>Start Lesson</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.message}>Lesson Started!</Text>
        )}
      </View>
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
  lessonCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
  },
});
