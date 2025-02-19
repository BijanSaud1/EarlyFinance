import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EarlyFinance</Text>
      <Text style={styles.subtitle}>An AI-Powered Financial Learning App for Kids</Text>

      {/* Call-To-Action Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/signup')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonOutline]}
        onPress={() => router.push('/login')}>
        <Text style={[styles.buttonText, styles.buttonOutlineText]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6F61',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#FF6F61',
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  buttonOutlineText: {
    color: '#FF6F61',
  },
});
