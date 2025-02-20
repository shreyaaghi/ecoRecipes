import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RecipeCategory } from './types';  // Adjust the import path as needed

const RECIPE_CATEGORIES: RecipeCategory[] = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks',
    'Desserts',
    'Drinks'
];

interface CategoryInputProps {
    category: RecipeCategory;
    setCategory: (category: RecipeCategory) => void;
}

const CategoryInput = ({ category, setCategory }: CategoryInputProps) => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.titles}>Category</Text>
                <View style={styles.categoryButtonsContainer}>
                    {RECIPE_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryButton,
                                category === cat && styles.categoryButtonSelected
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryButtonText,
                                category === cat && styles.categoryButtonTextSelected
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

export { CategoryInput };

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        marginVertical: 5,
        justifyContent: "space-evenly"
    },
    titles: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    categoryButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 5,
    },
    categoryButton: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
        marginBottom: 8,
        marginRight: 8,
    },
    categoryButtonSelected: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    categoryButtonText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '500',
    },
    categoryButtonTextSelected: {
        color: 'white',
    },
});