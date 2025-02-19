import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
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
        console.error('Error checking session:', error);
        router.push('/'); // Redirect if an error occurs
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) return null; // Prevents UI flickering

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Your Dashboard</Text>
        <Text style={styles.subtitle}>Let's get started with your learning!</Text>
      </View>

      {/* Content Section */}
      <View style={styles.cardsContainer}>
        {/* Lesson Card */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/lessonPage')}>
          <Text style={styles.cardTitle}>Lesson Page</Text>
          <Text style={styles.cardDescription}>Browse and start lessons to improve your financial knowledge.</Text>
        </TouchableOpacity>

        {/* Quiz Card */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/quizPage')}>
          <Text style={styles.cardTitle}>Quiz Page</Text>
          <Text style={styles.cardDescription}>Test your knowledge and improve your financial skills.</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Button
          title="Logout"
          onPress={async () => {
            try {
              await fetch('http://localhost:5001/api/logout', {
                method: 'POST',
                credentials: 'include', // Ensures cookies are sent for session clearing
              });
              router.replace('/'); // Redirect to login
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }}
        />
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
  },
  footer: {
    marginTop: 20,
  },
});
