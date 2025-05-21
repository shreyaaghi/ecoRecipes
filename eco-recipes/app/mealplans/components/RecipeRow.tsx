import { Dimensions, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface MealPlanRecipe {
    [props: string | number]: any;
    time: any;
    recipeName: any;
    recipeId: any;
}

const RecipeRow = ({ index, setRecipes, recipes, day }: any) => {
    const update = (val: string, type: string) => {
        setRecipes(recipes.map((recipe: MealPlanRecipe, i: number) => {
            if (i === index) {
                recipe[type] = val;
            }
            return recipe;
        }));
    }

    const handleRecipeSearch = () => {
        // open the recipe search modal
        // TODO: modify existing modal
        console.log(`opening recipe search modal`);
    };

    const handleDeleteRecipe = () => {
        // remove the recipe from the array
        const updatedRecipes = recipes.filter((_: MealPlanRecipe, i: number) => i !== index);
        setRecipes(updatedRecipes);
        console.log(`deleting recipe ${index}`);
    };

    return (
        <View>
            <View style={styles.container}>
                <TextInput
                    style={styles.timeInput}
                    placeholder="Time"
                    value={recipes[index].time}
                    onChangeText={(text => update(text, "time"))}
                    clearButtonMode="while-editing"
                />
                <TouchableOpacity
                    style={styles.recipeButton}
                    onPress={handleRecipeSearch}
                >
                    <Text style={styles.recipeButtonText}>
                        {recipes[index].recipeName || "Click to search..."}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleRecipeSearch}
                >
                    <FontAwesome name="pencil" size={18} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteRecipe}
                >
                    <FontAwesome name="trash-o" size={18} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    )
};

export { RecipeRow };

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginVertical: 8,
        justifyContent: "space-between"
      },
      timeInput: {
        height: 40,
        width: width * 0.25,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "black",
        paddingHorizontal: 10,
        marginRight: 10,
      },
      recipeButton: {
        height: 40,
        flex: 1,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginRight: 10,
      },
      recipeButtonText: {
        color: "black",
        fontSize: 16,
        textDecorationLine: 'underline',
      },
      editButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      },
      deleteButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontSize: 18,
      },
});  