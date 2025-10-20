import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView, Image } from 'react-native';
import { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import useUsersGet from '@/data/users-get';
import useMessagePost from '@/data/message-post';

export default function DetailsScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { userId } = useLocalSearchParams();
  const { data: usersData, isLoading } = useUsersGet();
  const { trigger: sendMessage } = useMessagePost();
  const cameraRef = useRef<CameraView>(null);

  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleRecipientToggle = (recipientId: string) => {
    setRecipients(prev =>
      prev.includes(recipientId)
        ? prev.filter(id => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      if (photo && photo.uri) {
        // Resize and compress the image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 600 } }], // Resize to 600px width, height will be proportional
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        if (manipulatedImage.base64) {
          setImage(`data:image/jpeg;base64,${manipulatedImage.base64}`);
        }
      }
    }
  };

  const handleSend = async () => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID');
      return;
    }
    const message = {
      text,
      sender: userId,
      image,
      recipients,
    };
    try {
      await sendMessage(message);
      setText('');
      setImage(null);
      setRecipients([]);
      // Maybe navigate back or show a success message
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
        />

                        <Text style={styles.label}>Select recipients:</Text>
        {isLoading ? (
          <Text>Loading users...</Text>
        ) : (
          usersData
            .filter((user: any) => user._id !== userId)
            .map((user: any) => (
              <View key={user._id} style={styles.recipientItem}>
                <Text>{user.username}</Text>
                <Switch
                  value={recipients.includes(user._id)}
                  onValueChange={() => handleRecipientToggle(user._id)}
                />
              </View>
            ))
        )}

        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={'back'} ref={cameraRef} />
        </View>
        <Button title="Take Picture" onPress={takePicture} />

        {image && <Image source={{ uri: image }} style={styles.preview} />}

        <Button title="Send" onPress={handleSend} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  recipientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  camera: {
    width: 300,
    height: 400,
  },
  preview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
  },
});
