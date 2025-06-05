import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { HomeNavButton } from '@/components/HomeNavButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function TabOneScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const api_url = process.env.EXPO_PUBLIC_API_URL || "";

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp && typeof decoded.exp == 'number') {
            const isValid = decoded.exp > currentTime

            if (!isValid) {
              await AsyncStorage.removeItem('userToken');
              Alert.alert("Session Expired", "Please log in again.")
              router.replace("/auth/login");
              return;
            }
          } else {
            await AsyncStorage.removeItem('userToken');
            Alert.alert("Invalid Token", "Please log in again.")
            router.replace("/auth/login");
            return;
          }

          try {
            let { data } = await axios.get(`${api_url}/users/`, { headers: { "x-access-token": token } });
            setUsername(data.data.username);
          } catch (error) {
            console.error("Error fetching user data:", error);
            Alert.alert("Error", "Failed to fetch user data. Please try again.")
          }
        } else {
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Error in token validation:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try logging in again.");
        router.replace("/auth/login");
      }
    })();
  }, [username !== ""]);

  const goToMealPlans = () => {
    router.navigate('/mealplans');
  };
  const goToRecipes = () => {
    router.navigate('/recipes');
  };
  const goToTipsAndTricks = () => {
    router.navigate('/tipsandtricks');
  }
  const goToWhySustainability = () => {
    router.navigate('/whysustainability');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
      <View style={{ backgroundColor: '#4BA9FF', flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.heading}>Welcome, {username}</Text>
        </View>
        <HomeNavButton title="Recipes" icon="RecipesImg" location="Recipes Button" onPress={goToRecipes}></HomeNavButton>
        <HomeNavButton title="Your Meal Plans" icon="MealPlansImg" location="Meal Plans Button" onPress={goToMealPlans}></HomeNavButton>
        <HomeNavButton title="Tips and Tricks" icon="TipsImg" location="Tips and Tricks Button" onPress={goToTipsAndTricks}></HomeNavButton>
        <HomeNavButton title="Why Sustainability?" icon="WhyImg" location="Why Sustainability Button" onPress={goToWhySustainability}></HomeNavButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    paddingTop: 10,
    color: 'white'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 30,
    backgroundColor: '#4BA9FF'
  },
  userImage: {
    height: 58,
    width: 50,
    borderRadius: 40,
  },
  userImageContainer: {
    height: 58,
    width: 50,
    borderRadius: 40,
  },
});
