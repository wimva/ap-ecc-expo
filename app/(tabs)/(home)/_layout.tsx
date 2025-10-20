import { Stack, useLocalSearchParams } from 'expo-router';

export default function HomeLayout() {
  const { userId } = useLocalSearchParams();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} initialParams={{ userId }} />
      <Stack.Screen name="post"  options={{ title: 'Post' }} initialParams={{ userId }} />
    </Stack>
  );
}
