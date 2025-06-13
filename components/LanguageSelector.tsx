import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={toggleLanguage}
    >
      <Text style={styles.text}>
        {i18n.language === 'fr' ? 'EN' : 'FR'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  text: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: Colors.accent,
  },
});