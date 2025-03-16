import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImageInputProps {
    image: string | null;
    setImage: (uri: string | null) => void;
    mimeType: string | undefined;
    setMimeType: (mimeType: string | undefined) => void;
}

const ImageInput = ({ image, setImage, mimeType, setMimeType }: ImageInputProps) => {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            base64: true,
            exif: true,
            legacy: true,
            aspect: [4, 3],
            quality: 0,
        });

        if (!result.canceled && result.assets[0].base64) {
            setImage(result.assets[0].base64);
            setMimeType(result.assets[0].mimeType);
        }
        // console.info(result.assets[0].uri);
    };
    const removeImage = () => {
        setImage(null);
        setMimeType(undefined);
    };

    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.titles}>Recipe Photo</Text>
                {image ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={removeImage}
                        >
                            <Text style={styles.removeButtonText}>x</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={pickImage}
                    >
                        <Text style={styles.buttonText}>Select Recipe Photo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export { ImageInput };

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
  selectButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    width: width * 0.8 - 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 10,
    width: width * 0.8 - 5,
    height: width * 0.6,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#ff4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
