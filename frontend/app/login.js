import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/login',
        { email, password },
        { withCredentials: true } // 🔹 Ensures cookies are sent for session authentication
      );

      console.log('Login Response:', response.data);

      // Log the response data to check if role is correctly returned
      console.log('User Role:', response.data.role);

      // Redirect based on user role (e.g., parent or child)
      if (response.data.role === 'parent') {
        console.log('Redirecting to Parent Dashboard');
        router.replace('/parentDashboard'); // Use replace to avoid back navigation to login
      } else {
        console.log('Redirecting to Child Dashboard');
        router.replace('/dashboard'); // Use replace to avoid back navigation to login
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { width: '100%', padding: 10, borderWidth: 1, marginBottom: 10 },
});

export default LoginPage;
