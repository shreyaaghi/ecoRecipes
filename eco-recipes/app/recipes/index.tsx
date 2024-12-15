import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, SafeAreaView } from 'react-native';
import { RecipeButton } from '@/components/RecipeButton';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SearchModal } from './components/SearchModal';
import { useNavigation } from '@react-navigation/native';
// import { AuthNavigationProp } from '../NavigationTypes';

const RecipesScreen: React.FC = () => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const api_url = process.env.EXPO_PUBLIC_API_URL||"";
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false })
  useEffect(()=>{
    (
      async () => {
        try {
          let { data } = await axios.get(`${api_url}/recipes/recipes/`);
          // console.info(data.data);
          setData(data.data);
        } catch(err){}
      }
    )();
  }, [data?.length > 0]);
  return (
  <SafeAreaView style={{flex: 1, backgroundColor: "#4BA9FF"}}>
  {/* <> */}
  
    <View style={styles.container}>
      <View style={styles.header}>
        
        <View>
          <Text style={styles.title}>Recipes</Text>
          <Text style={styles.subtitle}>Select from a sustainable catalong of recipes for your meals.</Text>
        </View>
        <TouchableOpacity style={styles.userImageContainer} onPress={()=>{
          setModalVisible(!modalVisible)
        }}>
            <FontAwesome 
            disabled={true}
            name="search" 
            size={50} 
            color="white"
            />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({item}: any)=><RecipeButton id={item.id} name={item.title}/>}
        keyExtractor={(plan: any) => plan.id}
        ></FlatList>
        <SearchModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
         
        </View>
        {/* </> */}
      </SafeAreaView>

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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    maxWidth: '80%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userImage: {
    height: 58,
    width: 50,
    borderRadius: 40,
  },
  userImageContainer: {
    padding: 15,
  },
});

export default RecipesScreen;