import { Dimensions, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { SelectModal } from './SelectModal';

interface MealPlanRecipe {
    [props: string | number]: any;
    time: any;
    recipeName: any;
    recipeId: any;
}

const RecipeRow = ({ index, setRecipes, recipes, day }: any) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedRecipe, setSelectedRecipe] = useState<any>();
    const router = useRouter();

    const update = (val: string, type: string) => {
        const updatedRecipes = recipes.map((recipe: MealPlanRecipe, i: number) => {
            if (i === index) {
                recipe[type] = val;
            }
            return recipe;
        });
        setRecipes(updatedRecipes);
    }

    const handleRecipeSearch = () => {
        // open the recipe search modal
        setModalVisible(!modalVisible)
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
                // implement check to make sure it's a valid time
                    style={styles.timeInput}
                    placeholder="Time"
                    value={recipes[index].time}
                    onChangeText={(text => update(text, "time"))}
                    clearButtonMode="while-editing"
                />
                {
                    recipes[index].recipeName ? (

                        <TouchableOpacity
                            style={styles.recipeButton}
                            onPress={() => router.navigate(`/recipes/${recipes[index].recipeId}`)}
                        >
                            <Text style={styles.recipeButtonText}>
                                {recipes[index].recipeName}
                            </Text>
                        </TouchableOpacity>
                    ) : (

                        <TouchableOpacity
                            style={styles.recipeButton}
                            onPress={handleRecipeSearch}
                        >
                            <Text style={styles.recipeButtonText}>Click to search...</Text>
                        </TouchableOpacity>
                    )
                }
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleRecipeSearch}
                >
                    <FontAwesome name="pencil" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteRecipe}
                >
                    <FontAwesome name="trash-o" size={18} color="white" />
                </TouchableOpacity>
                <SelectModal modalVisible={modalVisible} setModalVisible={setModalVisible} update={update} recipe={recipes[index]} />
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
        width: width * 0.2,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "black",
        paddingHorizontal: 10,
        marginRight: 10,
    },
    recipeButton: {
        height: 40,
        borderRadius: 10,
        width: width * 0.25,
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'center',
    },
    recipeButtonText: {
        color: "black",
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    editButton: {
        height: 30,
        width: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    },
    deleteButton: {
        height: 30,
        width: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    buttonText: {
        fontSize: 18,
    },
});  