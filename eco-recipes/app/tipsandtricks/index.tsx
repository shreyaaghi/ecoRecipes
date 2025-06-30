import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Link } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

const TipButton = ({ title, subtitle, route }: Record<string, string>) => (
  <View style={styles.tipButton}>
    <Link href={route}>
      {/* <TouchableOpacity style={styles.tipButton}> */}
      <View>
        <Text style={styles.tipButtonTitle}>{title}</Text>
        <Text style={styles.tipButtonSubtitle}>{subtitle}</Text>
      </View>
    </Link>
  </View>
);

const TipsAndTricksScreen = () => {
  const router = useRouter();
  const navigateToTip = (tipName: string) => {
    router.navigate(`/tipsandtricks/${tipName}`);
  };
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.textHeader}>
          <Text style={styles.title}>Tips and Tricks!</Text>
          <Text style={styles.subtitle}>Learn how you can make more eco-friendly food choices.</Text>
        </View>
      </View>
      <ScrollView>
        <TipButton
          title="Seasonal Eating"
          subtitle="Why eat seasonally?"
          route="tipsandtricks/seasonal-eating"
        />
        <TipButton
          title="Local Sourcing"
          subtitle="Discover the benefits of purchasing locally."
          route="tipsandtricks/local-sourcing"
        />
        <TipButton
          title="Plant-Based Eating"
          subtitle="The best way to lower your carbon footprint."
          route="tipsandtricks/plant-based-eating"
        />
        <TipButton
          title="Grow It Yourself"
          subtitle="Know what goes into your own meals."
          route="tipsandtricks/grow-it-yourself"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4BA9FF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    color: '#4BA9FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textHeader: {
    width: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 25,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
  },
  tipButton: {
    paddingTop: 25,
    paddingLeft: 5,
    paddingBottom: 25,
    marginBottom: 30,
    marginHorizontal: 5,
    backgroundColor: "#41BD4B",
    borderRadius: 20
  },
  tipButtonTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10
  },
  tipButtonSubtitle: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10
  },
  userImage: {
    height: 58,
    width: 50,
    borderRadius: 40,
  },
  userImageContainer: {
    height: 58,
    width: 50,
    borderRadius: 40,
  },
});

export default TipsAndTricksScreen;