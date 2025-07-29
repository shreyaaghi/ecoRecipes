import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigation, useRouter } from 'expo-router';

// Recipe interface, type checks recipe data
interface Recipe {
  id: number;
  title: string;
  author: string;
  description: string;
  steps: string;
  category: string;
  sustainability_info: string;
  recipe_photo: string | null;
  created_at: string;
  user_generated: boolean; sustainability_score?: number;
  sustainable_aspects?: string[];
  improvement_suggestions?: string[];
  sustainability_reasoning?: string;
  ai_generated_sustainability?: boolean;
}
interface Ingredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  name: string;
  amount: string;
  created_at: string;
  comments: string;
}

const Recipe = () => {
  const pathname = usePathname();
  const router = useRouter();
  let id = pathname.substring(pathname.lastIndexOf("/") + 1);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[] | null>(null);
  const api_url = process.env.EXPO_PUBLIC_API_URL || "";
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(`${api_url}/recipes/${id}`);
        setRecipe(data.data[0]);
        const { data: ingredientData } = await axios.get(`${api_url}/recipe-ingredients/recipes/${id}`)
        setIngredients(ingredientData.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return null;
  }

  const formatSteps = (steps: string) => {
    return steps.split('```').filter(step => step.trim() !== '').map((step, index) => (
      <Text key={index} style={styles.step}>{index + 1}. {step.trim()}</Text>
    ));
  };

  const formatSustainabilityInfo = (info: string) => {
    return info.split('```').filter(item => item.trim() !== '').map((item, index) => (
      <Text key={index} style={styles.sustainabilityItem}>• {item.trim()}</Text>
    ));
  };

  const formatIngredients = () => {
    if (!ingredients) {
      return;
    }
    return ingredients.map((ingredient, index) => (
      <Text key={index} style={styles.ingredient}>{index + 1}. {ingredient.amount} {ingredient.name.trim()}  {ingredient.comments}</Text>
    ));
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const handleBack = () => {
    router.back();
  };

  const renderAISustainabilityInfo = () => {
    if (!recipe.ai_generated_sustainability || !recipe.sustainability_score) {
      return null;
    }

    return (
      <View style={styles.aiSustainabilityContainer}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiTitle}>🤖 AI Sustainability Analysis</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor(recipe.sustainability_score) }]}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(recipe.sustainability_score) }]}>
              {recipe.sustainability_score}
            </Text>
            <Text style={styles.scoreOutOf}>/100</Text>
          </View>
          <View style={styles.scoreLabelContainer}>
            <Text style={[styles.scoreLabel, { color: getScoreColor(recipe.sustainability_score) }]}>
              {getScoreLabel(recipe.sustainability_score)}
            </Text>
            <Text style={styles.scoreDescription}>Sustainability Score</Text>
          </View>
        </View>

        {recipe.sustainable_aspects && recipe.sustainable_aspects.length > 0 && (
          <View style={styles.aspectsContainer}>
            <Text style={styles.aspectsTitle}>✅ What Makes This Recipe Sustainable</Text>
            {recipe.sustainable_aspects.map((aspect, index) => (
              <Text key={index} style={styles.aspectItem}>• {aspect}</Text>
            ))}
          </View>
        )}

        {recipe.improvement_suggestions && recipe.improvement_suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>💡 What Could Improve</Text>
            {recipe.improvement_suggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestionItem}>• {suggestion}</Text>
            ))}
          </View>
        )}

        {recipe.sustainability_reasoning && (
          <View style={styles.reasoningContainer}>
            <Text style={styles.reasoningTitle}>🧠 Analysis Summary</Text>
            <Text style={styles.reasoningText}>{recipe.sustainability_reasoning}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderManualSustainabilityInfo = () => {
    if (recipe.ai_generated_sustainability || !recipe.sustainability_info) {
      return null;
    }
    return (
      <View style={styles.manualSustainabilityContainer}>
        <Text style={styles.sectionTitle}>Sustainability Info:</Text>
        {formatSustainabilityInfo(recipe.sustainability_info)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: recipe.recipe_photo !== null
                  ? recipe.recipe_photo
                  : `https://fakeimg.pl/${Dimensions.get('window').width}x${Dimensions.get('window').height * 0.25}?text="${recipe.title}"`
              }}
              style={styles.image}
            />
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.author}>By: {recipe.author}</Text>
          <Text style={styles.category}>Category: {recipe.category}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {formatIngredients()}
          <Text style={styles.sectionTitle}>Steps:</Text>
          {formatSteps(recipe.steps)}
          {renderAISustainabilityInfo()}
          {renderManualSustainabilityInfo()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#41BD4B"
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#41BD4B",
  },
  scrollView: {
    flex: 1,
    width: width,
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: height,
  },
  imageContainer: {
    position: 'relative',
    width: Dimensions.get("window").width - 32,
    height: Dimensions.get("window").height * 0.25,
    borderRadius: 40,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    zIndex: 1,
  },
  backButtonText: {
    color: '#4BA9FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 32
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "white"
  },
  author: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    marginBottom: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  description: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: 'white'
  },
  step: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold'
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold'
  },
  sustainabilityItem: {
    fontSize: 14,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold'
  },
  aiSustainabilityContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
  },
  aiHeader: {
    marginBottom: 15,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreOutOf: {
    fontSize: 12,
    color: '#666',
  },
  scoreLabelContainer: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
  },
  aspectsContainer: {
    marginBottom: 15,
  },
  aspectsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  aspectItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginBottom: 15,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  reasoningContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
  },
  reasoningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },

  manualSustainabilityContainer: {
    marginTop: 10,
  },
});

export default Recipe;