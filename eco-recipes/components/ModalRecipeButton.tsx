import React from 'react';
import { Text } from "./Themed";
import { StyleSheet, TouchableOpacity, View, ImageBackground } from "react-native";
import { useRouter } from 'expo-router';

interface ModalRecipeButtonProps {
  name: string;
  id: string;
  image?: string | null;
  closeModal: () => void;
}

const ModalRecipeButton = ({ name, id, image, closeModal }: ModalRecipeButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.navigate(`/recipes/${id}`);
    closeModal();
  };

  return (
    <TouchableOpacity key={id} style={styles.cardWrapper} onPress={handlePress}>
      {image ? (
        <ImageBackground
          source={{ uri: image }}
          resizeMode="cover"
          style={styles.cardWithImage}
          imageStyle={styles.imageBackground}
        >
          <View style={styles.overlay}>
            <Text style={styles.buttonText}>{name}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.noImageCard}>
          <Text style={styles.buttonText}>{name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 40,
    marginHorizontal: 5,
    width: 330,
  },
  cardWithImage: {
    height: 150,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageBackground: {
    borderRadius: 30,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noImageCard: {
    backgroundColor: "#4BA9FF",
    borderRadius: 25,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export { ModalRecipeButton };
