import { Modal, Pressable, Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const api_url = process.env.EXPO_PUBLIC_API_URL || "";
import axios from 'axios';
import { RecipeButton } from "@/components/RecipeButton";

const SearchModal = ({ modalVisible, setModalVisible }: any) => {
  const [recipeSearch, setRecipeSearch] = useState("");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const search = async () => {
    try {
      let { data } = await axios.get(`${api_url}/recipes/search/${recipeSearch}`);
      // console.info(data.data);
      setData(data.data);
    } catch (err) { }
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.closeContainer} onPress={() => {
                setModalVisible(!modalVisible)
              }}>
                <AntDesign
                  disabled={true}
                  name="close"
                  size={35}
                  color="white"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="ex. pancakes..."
                value={recipeSearch}
                onChangeText={(text) => setRecipeSearch(text)}
              />
              <TouchableOpacity style={styles.searchContainer} onPress={() => {
                search();
              }}>
                <FontAwesome
                  disabled={true}
                  name="search"
                  size={35}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              renderItem={({ item }: any) => <RecipeButton id={item.id} name={item.title} />}
              keyExtractor={(plan: any) => plan.id}
            ></FlatList>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export { SearchModal };

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#4BA9FF',
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#41BD4B',
    height: height * 0.85,
    width: width * 0.9,
    borderRadius: 20,
    padding: 0,
    alignItems: 'center',
  },
  topBar: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    paddingTop: 15,
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeContainer: {
    paddingRight: 10
    // alignSelf: "flex-start",
    // padding: 10
  },
  input: {
    height: 40,
    width: width * 0.65,
    borderRadius: 10,
    // margin: 15,
    borderWidth: 2,
    // padding: 10,
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    color: "black"
  },
  searchContainer: {
    // alignSelf: "flex-end",
    paddingLeft: 10
  }
});

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#4BA9FF',
//       padding: 20,
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       marginBottom: 20,
//     },
//     title: {
//       fontSize: 32,
//       fontWeight: 'bold',
//       color: 'white',
//       marginBottom: 10,
//     },
//     subtitle: {
//       fontSize: 16,
//       color: 'white',
//       maxWidth: '80%',
//     },
//     button: {
//       backgroundColor: '#4CAF50',
//       padding: 15,
//       borderRadius: 25,
//       marginBottom: 15,
//       alignItems: 'center',
//     },
//     buttonText: {
//       color: 'white',
//       fontSize: 18,
//       fontWeight: 'bold',
//     },
//     userImage: {
//       height: 58,
//       width: 50,
//       borderRadius: 40,
//     },
//     userImageContainer: {
//       padding: 15,
//     },
//   });