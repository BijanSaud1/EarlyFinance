import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [parentEmail, setParentEmail] = useState(''); // 👈 Added for child linking
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/session', {
          withCredentials: true, // 🔹 Ensures session cookies are sent
        });

        if (response.data.isAuthenticated) {
          router.replace('/dashboard'); // ✅ Redirect if already logged in
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, []);

  const handleSignUp = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/signup',
        { email, password, role, parentEmail },
        { withCredentials: true } // 🔹 Ensures session is stored in cookies
      );

      console.log('✅ Signup successful');
      setMessage('User created successfully!');
      router.replace('/dashboard'); // ✅ Redirect to Dashboard
    } catch (error) {
      console.error('❌ Signup Error:', error.response?.data || error.message);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Role (parent/child)" value={role} onChangeText={setRole} />

      {/* ✅ Parent email field only if role is 'child' */}
      {role.toLowerCase() === 'child' && (
        <TextInput style={styles.input} placeholder="Parent's Email" value={parentEmail} onChangeText={setParentEmail} />
      )}

      <Button title="Sign Up" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}
