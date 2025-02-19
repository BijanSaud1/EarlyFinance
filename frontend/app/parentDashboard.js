import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const ParentDashboard = () => {
  const [parentData, setParentData] = useState(null);
  const [children, setChildren] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track if authenticated
  const router = useRouter();

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
        });
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          console.log('❌ No session found. Redirecting to login.');
          router.push('/'); // Redirect to login if session is not active
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/'); // Redirect to login if session check fails
      }
    };

    checkSession();
  }, []);

  // Fetch parent and children data once authenticated
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/parent/parent-info', {
        withCredentials: true, // 🔹 Ensures session is validated on the backend
      });
      setParentData(response.data.parent);
      setChildren(response.data.children);
    } catch (error) {
      console.error('Error fetching parent data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent for session clearing
      });
      setIsAuthenticated(false);  // Mark as logged out
      router.push('/'); // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parent Dashboard</Text>
      {parentData ? (
        <>
          <Text style={styles.info}>Email: {parentData.email}</Text>
          <Text style={styles.info}>Role: {parentData.role}</Text>
          <Text style={styles.subHeading}>Children:</Text>
          <ScrollView style={styles.childrenList}>
            {children.length > 0 ? (
              children.map((child, index) => (
                <View key={index} style={styles.childItem}>
                  <Text>{child.email}</Text>
                </View>
              ))
            ) : (
              <Text>No children linked to this account.</Text>
            )}
          </ScrollView>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 10 },
  subHeading: { fontSize: 22, marginVertical: 20 },
  childrenList: { width: '100%' },
  childItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
});

export default ParentDashboard;  // ✅ Ensure default export
