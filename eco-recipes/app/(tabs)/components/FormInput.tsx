import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

const FormInput = ({ name, value, onChangeText }: any) => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.titles}>{name}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={`Enter ${name} here `}
                    value={value}
                    onChangeText={(text => onChangeText(text))}
                />
            </View>
        </View>
    )
};

export { FormInput };

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