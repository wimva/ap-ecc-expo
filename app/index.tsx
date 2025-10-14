import { View, Alert, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import useMessages from '@/data/messages';
import { useEffect, useState } from 'react';
import {API_URL} from '@/constants/Api'
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import useSWRMutation from 'swr/mutation';

export default function LoginScreen() {
   const router = useRouter();
   const [email, setEmail] = useState('');

    useEffect(() => {
        const checkLogin = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                router.replace('/(tabs)');
            }
        };
    
        checkLogin();
    }, []);

  // Email login additions
  const fetchUserByEmail = async (url: string, { arg }: { arg: string }) => {
    const res = await fetch(`${API_URL}/users/by-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: arg }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Failed to fetch user by email');
    }
    return res.json();
  };

  const { trigger: getUserByEmail, isMutating } = useSWRMutation('/users/by-email', fetchUserByEmail);

  const handleEmailLogin = async () => {
    if (!email) {
      Alert.alert('Please enter an email address');
      return;
    }
    try {
      const data = await getUserByEmail(email);
      const userId = data?.id ?? data?.user?.id;
      if (!userId) {
        Alert.alert('User not found', 'Server did not return a user id');
        return;
      }
      await AsyncStorage.setItem('userId', userId);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.log(err);
      Alert.alert('Error', err?.message ?? 'Failed to get user by email');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity onPress={handleEmailLogin} disabled={isMutating} style={[styles.button, isMutating && styles.buttonDisabled]}>
           <ThemedText type="title">{isMutating ? 'Logging in...' : 'LOGIN WITH EMAIL'}</ThemedText>     
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
  input: {
    height: 44,
    width: '80%',
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
