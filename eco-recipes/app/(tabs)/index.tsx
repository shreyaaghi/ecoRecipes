import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { HomeNavButton } from '@/components/HomeNavButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthenticated } from '@/hooks'; 

export default function TabOneScreen() {
  const router = useRouter();
  const api_url = process.env.EXPO_PUBLIC_API_URL || "";

  const username = useAuthenticated();

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
        <HomeNavButton title="Recipes" icon="chef-hat" size={40} color="white" location="Recipes Button" onPress={goToRecipes}></HomeNavButton>
        <HomeNavButton title="Your Meal Plans" icon="silverware-fork-knife" size={40} color="white" location="Meal Plans Button" onPress={goToMealPlans}></HomeNavButton>
        <HomeNavButton title="Tips and Tricks" icon="lightbulb" size={40} color="white" location="Tips and Tricks Button" onPress={goToTipsAndTricks}></HomeNavButton>
        <HomeNavButton title="Why Sustainability?" icon="leaf" size={40} color="white" location="Why Sustainability Button" onPress={goToWhySustainability}></HomeNavButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
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
  }
});
