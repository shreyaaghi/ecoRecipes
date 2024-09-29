import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { RecipeButton } from '@/components/RecipeButton';

const RecipesScreen: React.FC = () => {
  const data = [
    {
      id: "hello",
      name: "world"
    }
  ]
  return (
  
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Recipes</Text>
          <Text style={styles.subtitle}>Select from a sustainable catalong of recipes for your meals.</Text>
        </View>
        <TouchableOpacity style={styles.userImageContainer}>
          <Image
            style={styles.userImage}
            source={require('@/assets/images/userProfile.jpg')}
            />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({item}: any)=><RecipeButton id={item.id} name={item.name}/>}
        keyExtractor={(plan: any) => plan.id}
        ></FlatList>
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
    height: 58,
    width: 50,
    borderRadius: 40,
  },
});

export default RecipesScreen;