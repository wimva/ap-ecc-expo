import { View, SafeAreaView, Alert, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import * as WebBrowser from 'expo-web-browser';


export default function HomeScreen() {
  const handleGoogleLogin = async () => {
    try {
      // URL to initiate the OAuth flow on your server
      const authUrl = 'http://localhost:3000/auth/google'; // Replace with your server URL

      // Generate the redirect URI
      const redirectUri = 'yourapp://auth/google/callback';

      // Open the web browser for Google authentication
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        // Handle the redirect URL
        const params = new URL(result.url).searchParams;

        // Extract any parameters (e.g., tokens, profile data)
        const user = params.get('user');
        console.log('Authenticated user:', user);
        Alert.alert('Authentication successful!', `Welcome, ${user}`);
      } else {
        Alert.alert('Authentication canceled or failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to authenticate with Google');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity  onPress={() => handleGoogleLogin()}>          
          <ThemedText type="title">LOGIN</ThemedText>
        </TouchableOpacity> 
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor:"#ccc",
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
