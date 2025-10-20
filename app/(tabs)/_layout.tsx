import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setUserId(userId);
      }
    };
    getUserId();
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen name="(home)" initialParams={{ userId }} options={{ headerShown: false, title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }} />
      <Tabs.Screen name="settings" initialParams={{ userId }} options={{ headerShown: false }}  />
    </Tabs>
  );
}
