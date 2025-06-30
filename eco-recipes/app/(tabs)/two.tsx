import { StyleSheet, Dimensions, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useNavigation } from 'expo-router';

export default function TabTwoScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const api_url = process.env.EXPO_PUBLIC_API_URL||"";

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="exit-run" size={80} color="black" />
        </View>
        <Text style={styles.text}>Are you sure you want to logout?</Text>
        <View>
          <TouchableOpacity style={styles.homeButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Go To Home</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.logOutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4BA9FF",
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: width * 0.8,
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: width * 0.6,
    height: height * 0.055,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logOutButton: {
    backgroundColor: "#ff4444",
    borderRadius: 20,
    width: width * 0.6,
    height: height * 0.055,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  }
});
