import { View, SafeAreaView, Image, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import useMessages from '@/data/messages-get';

export default function HomeScreen() {
  const { data, isLoading, isError } = useMessages();

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText type="title">Home</ThemedText>
        {data.map((message: any) => (
          <View key={message._id} style={styles.messageContainer}>
            <ThemedText>{message.text}</ThemedText>
            {message.image && (
              <Image 
                source={{ uri: message.image }} 
                style={styles.messageImage} 
                resizeMode="contain"
              />
            )}
          </View>
        ))}
        <Link href="/post"><ThemedText>Create Message</ThemedText></Link>
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
  messageContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
  },
  messageImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
