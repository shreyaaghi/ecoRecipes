import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { TouchableOpacity, Image } from "react-native";
import { HomeNavButton } from '@/components/HomeNavButton';


import axios from 'axios';

export default function TabOneScreen() {
  const [username, setUsername] = useState<string>("John");

  const api_url = process.env.EXPO_PUBLIC_API_URL||"";
  useEffect(()=>{
    const get_data = async () => {
      let res = await axios.get(`${api_url}/`);
      console.info(res);
    };

    get_data();
  }, []);
  const hello = async () => {
    console.info(api_url);
    let res = await axios.get(`${api_url}/`)
      .then(res => console.info(res))
      .catch(err => console.error(err));
    // console.info("hello");
  }
  return (
    <View style={{ backgroundColor: '#4BA9FF' }}>
      <View style={styles.row}>
        <Text style={styles.heading}>Welcome, {username}</Text>
        <TouchableOpacity style={styles.userImageContainer}>
          <Image
          style={styles.userImage}
          source={require('@/assets/images/userProfile.jpg')}
          />
        </TouchableOpacity>
      </View>
      <HomeNavButton title="Recipes" icon="RecipesImg" location="Recipes Button"></HomeNavButton>
      <HomeNavButton title="Your Meal Plans" icon="MealPlansImg" location="Meal Plans Button"></HomeNavButton>
      <HomeNavButton title="Tips and Tricks" icon="TipsImg" location="Tips and Tricks Button"></HomeNavButton>
      <HomeNavButton title="Why Sustainablity?" icon="WhyImg" location="Why Sustainabliity Button"></HomeNavButton>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    paddingTop: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom:30,
    backgroundColor: '#4BA9FF'
  },
  userImage: {
    height: 58,
    width: 50,
    borderRadius:40,
  },
  userImageContainer: {
    height: 58,
    width: 50,
    borderRadius: 40,
  },
});
