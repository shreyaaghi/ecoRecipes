import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

const StepInput = ({ index, setSteps, steps }: any) => {
    const update = (val: string) => {
        setSteps(steps.map((step: string, i: number) => {
            if(i === index){
                return val;
            }
            return step;
        }));
    }
   
    // sustainability information, category 
    
    return (
        <View>
            <View style={styles.container}>
            <Text style={styles.titles}>Step {index + 1}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={`Enter step ${index + 1} here (ex. preheat oven to 350°F)`}
                    value={steps[index]}
                    onChangeText={(text => update(text))}
                    clearButtonMode="while-editing"
                />
            </View>
        </View>
    )
};

export { StepInput };

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        marginVertical: 5,
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