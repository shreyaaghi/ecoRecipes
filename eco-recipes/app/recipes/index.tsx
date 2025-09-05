import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Alert, Dimensions, TextInput } from 'react-native';
import { RecipeButton } from '@/components/RecipeButton';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SearchModal } from './components/SearchModal';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const items_per_page = 10;

const RecipesScreen: React.FC = () => {
  const [allRecipes, setAllRecipes] = useState<Record<string, unknown>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isFindingWithIngredients, setIsFindingWithIngredients] = useState(false);
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const api_url = process.env.EXPO_PUBLIC_API_URL || "";
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    if (!api_url) {
      setIsLoading(false);
      return;
    }
    fetchAllRecipes();
  }, []);

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

  const discoverRecipeFromWeb = async () => {
    if (isDiscovering) return;

    setIsDiscovering(true);
    try {
      const response = await axios.post(`${api_url}/ai/create`);

      if (response.data && response.data.recipe) {
        Alert.alert(
          "Recipe Discovered! 🎉",
          `Found and saved: "${response.data.recipe.title}"`,
          [
            {
              text: "View Recipe",
              onPress: () => router.navigate(`/recipes/${response.data.recipe.id}`)
            },
            {
              text: "Stay Here",
              style: "cancel",
              onPress: () => {
                fetchAllRecipes();
              }
            }
          ]
        );
      } else {
        fetchAllRecipes();
      }
    } catch (error) {
      console.error('Error discovering recipe:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const findRecipeWithIngredients = async () => {
    if (isFindingWithIngredients) return;

    if (!ingredientsInput.trim()) {
      Alert.alert("Please enter ingredients first!");
      return;
    }

    setIsFindingWithIngredients(true);
    try {
      const response = await axios.post(`${api_url}/ai/create-with-ingredients`, {
        ingredients: ingredientsInput,
      });

      if (response.data && response.data.recipe) {
        Alert.alert(
          "Recipe Found! 🎉",
          `Created from your ingredients: "${response.data.recipe.title}"`,
          [
            {
              text: "View Recipe",
              onPress: () => router.navigate(`/recipes/${response.data.recipe.id}`)
            },
            {
              text: "Stay Here",
              style: "cancel",
              onPress: () => {
                fetchAllRecipes();
              }
            }
          ]
        );
      } else {
        fetchAllRecipes();
      }
    } catch (error) {
      console.error('Error finding recipe with ingredients:', error);
    } finally {
      setIsFindingWithIngredients(false);
    }
  };

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
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Recipes</Text>
          <Text style={styles.subtitle}>Choose from existing recipes, or discover your own.</Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.discoverButton, isDiscovering && styles.discoverButtonDisabled]}
            onPress={discoverRecipeFromWeb}
            disabled={isDiscovering}
          >
            {isDiscovering ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.buttonText}>Finding...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="explore" size={20} color="white" />
                <Text style={styles.buttonText}>Discover Recipe</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome name="search" size={20} color="white" />
            <Text style={styles.buttonText}>Search Recipes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsLabel}>Enter ingredients:</Text>
          <View style={styles.ingredientsInputWrapper}>
            <TextInput
              style={styles.ingredientsInput}
              placeholder="e.g. tomato, garlic, basil"
              placeholderTextColor="gray"
              value={ingredientsInput}
              onChangeText={setIngredientsInput}
            />
          </View>

          <TouchableOpacity
            style={[styles.ingredientsButton, isFindingWithIngredients && styles.discoverButtonDisabled]}
            onPress={findRecipeWithIngredients}
            disabled={isFindingWithIngredients}
          >
            {isFindingWithIngredients ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.buttonText}>Finding...</Text>
              </>
            ) : (
              <>
                <AntDesign name="pluscircleo" size={20} color="white" />
                <Text style={styles.buttonText}>Find w/ Ingredients</Text>
              </>
            )}
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
            showsVerticalScrollIndicator={false}
          />

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

const { width } = Dimensions.get('window');

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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#4BA9FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },

  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  discoverButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#41BD4B',
    borderRadius: 15,
    paddingVertical: 15,
    gap: 8,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 15,
    gap: 8,
  },
  discoverButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginHorizontal: 4,
    minWidth: 36,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
  pageInfo: {
    color: 'white',
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    minWidth: 120,
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ingredientsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ingredientsLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  ingredientsInputWrapper: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  ingredientsInput: {
    fontSize: 16,
    color: "#333",
  },
  ingredientsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#41BD4B",
    borderRadius: 15,
    paddingVertical: 15,
    gap: 8,
  },
});

export default RecipesScreen;