import { View, Alert, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import {API_URL} from '@/constants/Api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import useUserLogin from '@/data/user-login';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { trigger: loginUser, isMutating } = useUserLogin();

  useEffect(() => {
      const checkLogin = async () => {
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
              router.replace('/(tabs)/(home)');
          }
      };
  
      checkLogin();
  }, []);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }
    try {
      const data = await loginUser({ email, password });
      const userId = data?.id ?? data?.user?.id;
      if (!userId) {
        Alert.alert('User not found', 'Server did not return a user id');
        return;
      }
      await AsyncStorage.setItem('userId', userId);
      router.replace('/(tabs)/(home)');
    } catch (err: any) {
      console.log(err);
      Alert.alert('Error', err?.message ?? 'Failed to log in');
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
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity onPress={handleEmailLogin} disabled={isMutating} style={[styles.button, isMutating && styles.buttonDisabled]}>
           <ThemedText type="title">{isMutating ? 'Logging in...' : 'LOGIN'}</ThemedText>     
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
