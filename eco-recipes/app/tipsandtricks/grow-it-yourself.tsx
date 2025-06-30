import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

const GrowItYourselfScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Grow It Yourself</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4BA9FF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 50,
  },
  backButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    color: '#4BA9FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginLeft: 30,
  },
});

export default GrowItYourselfScreen;