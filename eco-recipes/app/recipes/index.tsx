import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, SafeAreaView, Button } from 'react-native';
import { RecipeButton } from '@/components/RecipeButton';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SearchModal } from './components/SearchModal';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import { AuthNavigationProp } from '../NavigationTypes';

const RecipesScreen: React.FC = () => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const api_url = process.env.EXPO_PUBLIC_API_URL || "";
  const navigation = useNavigation();
  const router = useRouter()
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, []);
  useEffect(() => {
    (
      async () => {
        try {
          let { data } = await axios.get(`${api_url}/recipes/recipes/`);
          // console.info(data.data);
          setData(data.data);
        } catch (err) { }
      }
    )();
  }, []);

  const handleBack = () => {
    router.back();
  };

  // data?.length > 0 in brackets above?
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
      {/* <> */}

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.textHeader}>
            <Text style={styles.title}>Recipes</Text>
            <Text style={styles.subtitle}>Select from a sustainable catalog of recipes for your meals.</Text>
          </View>
          <TouchableOpacity style={styles.searchImageContainer} onPress={() => {
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
        <View style={styles.listContainer}>
          <FlatList
            data={data}
            renderItem={({ item }: any) => <RecipeButton id={item.id} name={item.title} />}
            keyExtractor={(plan: any) => plan.id}
          ></FlatList>
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  back: {
    paddingTop: 7,
    paddingRight: 5
  },
  textHeader: {
    width: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
  },
  listContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
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
  searchImageContainer: {
    // padding: 15,
  },
});


export default RecipesScreen;