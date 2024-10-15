import { View, SafeAreaView, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the user ID is already stored
    const checkAuthStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          console.log(userId);
          // Navigate to tabs if user is already authenticated
          router.replace('/(tabs)');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // URL to initiate the OAuth flow on your server
      const authUrl = 'https://ap-ecc-express.onrender.com/auth/google'; // Replace with your server URL
      const redirectUri = AuthSession.makeRedirectUri();

      // Open the web browser for Google authentication
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        // Handle the redirect URL
        const params = new URL(result.url).searchParams;

        // Extract user ID or other parameters (e.g., tokens, profile data)
        const user = params.get('user'); // Replace with the correct parameter from your server's redirect URL
        if (user) {
          // Store the user ID
          await AsyncStorage.setItem('userId', user);

          // Navigate to tabs after successful login
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Authentication canceled or failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to authenticate with Google');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleGoogleLogin()}>
          <ThemedText type="title">LOGIN</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ccc",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
