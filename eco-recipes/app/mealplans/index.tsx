import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { MealPlanButton } from '@/components/MealPlanButton';
import { useRouter } from 'expo-router';

const MealPlansScreen: React.FC = () => {
  const router = useRouter();
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
          <Text style={styles.title}>Your Meal Plans</Text>
          <Text style={styles.subtitle}>View and edit your existing meal plans or create a new one.</Text>
        </View>
        <TouchableOpacity style={styles.userImageContainer}>
          <Image
            style={styles.userImage}
            source={require('@/assets/images/userProfile.jpg')}
            />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.navigate(`/mealplans/CreateMealPlan/`)}>
        <Text style={styles.buttonText}>Create Meal Plan</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={({item}: any)=><MealPlanButton id={item.id} name={item.name}/>}
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
    flexDirection: 'row',
    justifyContent: "space-around",
    paddingTop: 30,
    paddingBottom: 30,
    marginBottom: 40,
    marginHorizontal: 20,
    backgroundColor: "#41BD4B",
    borderRadius: 30
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
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

export default MealPlansScreen;