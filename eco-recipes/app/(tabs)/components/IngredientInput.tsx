import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

interface Ingredient {
    [props: string|number]: any;
    name: string;
    amount: string|number;
    comments: string;
}


const IngredientInput = ({ index, setIngredients, ingredients }: any) => {
    const update = (val: string, type: string) => {
        setIngredients(ingredients.map((ingredient: Ingredient, i: number) => {
            if(i === index){
                ingredient[type] = val;
            }
            return ingredient
        }));
    }
   
    // steps, sustainability information 
    
    return (
        <View>
            <View style={styles.container}>
            <Text style={styles.titles}>Ingredient</Text>
                <TextInput
                    style={styles.input}
                    placeholder={`Enter name here (ex. Vanilla Extract) `}
                    value={ingredients[index].name}
                    onChangeText={(text => update(text, "name"))}
                    clearButtonMode="while-editing"
                />
                <TextInput
                    style={styles.input}
                    placeholder={`Enter amount here (ex. 3 tbsp, a pinch) `}
                    value={ingredients[index].amount}
                    onChangeText={(text => update(text, "amount"))}
                    clearButtonMode="while-editing"
                />
                <TextInput
                    style={styles.input}
                    placeholder={`Enter comments here (ex. "optional")`}
                    value={ingredients[index].comments}
                    onChangeText={(text => update(text, "comments"))}
                    clearButtonMode="while-editing"
                />
            </View>
        </View>
    )
};

export { IngredientInput };

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        marginVertical: 15,
        justifyContent: "space-evenly"
    },
    input: {
        height: 40,
        width: width * 0.8 - 5,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        color: "black",
        marginVertical:5
    },
    titles: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    heading: {
        fontSize: 50,
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 60,
        color: "#fff"
    },
    body: {
        backgroundColor: '#4BA9FF',
        flex: 1,
        paddingTop: 40
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        marginTop: 10,
        borderRadius: 15,
        width: '25%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});  