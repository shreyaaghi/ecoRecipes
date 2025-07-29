import { Dimensions, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { SelectModal } from './SelectModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface MealPlanRecipe {
    [props: string | number]: any;
    time: any;
    recipeName: any;
    recipeId: any;
}

const RecipeRow = ({ index, setRecipes, recipes, day }: any) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedRecipe, setSelectedRecipe] = useState<any>();
    const [showTimePicker, setShowTimePicker] = useState(false);
    const router = useRouter();

    const handleTimeChange = (_event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const formatted = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            update(formatted, "time");
        }
    };

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
    };

    const handleDeleteRecipe = () => {
        // remove the recipe from the array
        const updatedRecipes = recipes.filter((_: MealPlanRecipe, i: number) => i !== index);
        setRecipes(updatedRecipes);
    };

    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={styles.timePickerText}>
                        {recipes[index].time || "Select time"}
                    </Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <View style={styles.timePickerContainer}>
                        <DateTimePicker
                            mode="time"
                            value={new Date()}
                            is24Hour={false}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                            style={styles.timePicker}
                        />
                        {Platform.OS === 'ios' && (
                            <View style={styles.timePickerActions}>
                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={() => setShowTimePicker(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.doneButton}
                                    onPress={() => setShowTimePicker(false)}
                                >
                                    <Text style={styles.doneButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
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
        marginBottom: 10,
        width: '100%',
    },
    timePickerButton: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginRight: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    timePickerText: {
        color: '#333',
    },
    timePickerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 1000,
        elevation: 5,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    timePicker: {
        width: '100%',
    },
    timePickerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    doneButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    doneButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#007AFF',
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