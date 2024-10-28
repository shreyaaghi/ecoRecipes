import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions, Image } from 'react-native';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from "axios";

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
    user_generated: boolean;
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
    let id = pathname.substring(pathname.lastIndexOf("/") + 1);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[] | null>(null);
    const api_url = process.env.EXPO_PUBLIC_API_URL||"";
    const [placeholderUrl, setPlaceholderUrl] = useState<string>("");

    useEffect(()=>{
        const fetchRecipe = async () => {
            try {
                const { data } = await axios.get(`${api_url}/recipes/${id}`);
                setRecipe(data.data[0]);
                setPlaceholderUrl(`https://placehold.co/400x300?text="Hi"`);
                console.info(placeholderUrl);
                console.info(data.data[0])
                const { data:ingredientData } = await axios.get(`${api_url}/recipe-ingredients/recipes/${id}`)
                setIngredients(ingredientData.data);
            } catch(err){
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
      if(!ingredients){
        return;
      }
      return ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>{index + 1}. {ingredient.amount} {ingredient.name.trim()}  {ingredient.comments}</Text>
      ));
  };

      return (
        <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            {
              // ternary: conditional rendering
              recipe.recipe_photo !== null ? (
                <Image 
                source={{ uri: recipe.recipe_photo }} 
                style = {{ width: Dimensions.get("window").width - 32, height: Dimensions.get("window").height * 0.25, borderRadius: 40 }}
                />
                ) : (
                <Image 
                source={{ uri: `https://fakeimg.pl/${Dimensions.get('window').width}x${Dimensions.get('window').height * 0.25}?text="${recipe.title}"` }} 
                // src={ "https://placehold.co/1024x400?text=Recipe" } ?
                style = {{ width: Dimensions.get("window").width - 32, height: Dimensions.get("window").height * 0.25, borderRadius: 40 }}
                />
              )
            }
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.author}>By: {recipe.author}</Text>
            <Text style={styles.category}>Category: {recipe.category}</Text>
            <Text style={styles.description}>{recipe.description}</Text>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {formatIngredients()}
            <Text style={styles.sectionTitle}>Steps:</Text>
            {formatSteps(recipe.steps)}
            <Text style={styles.sectionTitle}>Sustainability Info:</Text>
            {formatSustainabilityInfo(recipe.sustainability_info)}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
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
    additionalInfo: {
      fontSize: 14,
      color: 'gray',
      marginTop: 16,
    },
    line: {
        width: '80%',
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
      },
  });

export default Recipe;