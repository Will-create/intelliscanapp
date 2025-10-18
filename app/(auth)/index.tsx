import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Redirect } from 'expo-router';
import Colors from '@/constants/Colors';

export default function SplashScreen() {
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
