import { Redirect } from 'expo-router';

export default function StartScreen() {
  return <Redirect href="/(auth)/login" />;
}