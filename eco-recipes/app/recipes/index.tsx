import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { RecipeButton } from '@/components/RecipeButton';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SearchModal } from './components/SearchModal';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

const items_per_page = 10; // Number of recipes to show per page

const RecipesScreen: React.FC = () => {
  const [allRecipes, setAllRecipes] = useState<Record<string, unknown>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const api_url = process.env.EXPO_PUBLIC_API_URL || "";
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      setIsLoading(true);
      let allRecipes: any[] = [];
      let page = 1;
      const pageSize = 100; 
      let hasMore = true;

      try {
        while (hasMore) {
          const { data } = await axios.get(
            `${api_url}/recipes/recipes/?pageSize=${pageSize}&pageNumber=${page}`
          );
          
          if (!data.data || data.data.length === 0) {
            hasMore = false;
          } else {
            allRecipes = [...allRecipes, ...data.data];
            page++;
          }
        }
        setAllRecipes(allRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // Fallback to just getting first page if something goes wrong
        try {
          const { data } = await axios.get(
            `${api_url}/recipes/recipes/?pageSize=100&pageNumber=1`
          );
          setAllRecipes(data.data);
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  const totalPages = Math.ceil(allRecipes.length / items_per_page);
  const startIndex = (currentPage - 1) * items_per_page;
  const endIndex = Math.min(startIndex + items_per_page, allRecipes.length);
  const currentRecipes = allRecipes.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4BA9FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={handleBack}>
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.textHeader}>
            <Text style={styles.title}>Recipes</Text>
            <Text style={styles.subtitle}>Select from a sustainable catalog of recipes for your meals.</Text>
          </View>
          <TouchableOpacity 
            style={styles.searchImageContainer} 
            onPress={() => setModalVisible(true)}
          >
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
            data={currentRecipes}
            renderItem={({ item }: any) => (
              <RecipeButton id={item.id} name={item.title} image={item.recipe_photo} />
            )}
            keyExtractor={(item: any) => item.id}
            ListEmptyComponent={
              <Text style={styles.noRecipesText}>No recipes found</Text>
            }
          />
          
          {/* Pagination Controls */}
          {allRecipes.length > 0 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <Text style={styles.paginationText}>««</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Text style={styles.paginationText}>‹</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageInfo}>
                Showing {startIndex + 1}-{endIndex} of {allRecipes.length}
              </Text>
              
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                onPress={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationText}>›</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                onPress={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationText}>»»</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <SearchModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4BA9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4BA9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  back: {
    marginRight: 16,
  },
  textHeader: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  searchImageContainer: {
    padding: 8,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  noRecipesText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageInfo: {
    color: 'white',
    marginHorizontal: 12,
    minWidth: 150,
    textAlign: 'center',
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RecipesScreen;