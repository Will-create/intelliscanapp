import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { ArrowLeft, Shield } from 'lucide-react-native';

export default function PrivacyScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Shield size={48} color={Colors.accent} />
          </View>
          <Text style={styles.headerText}>{t('privacy.header')}</Text>
          <Text style={styles.subheaderText}>{t('privacy.lastUpdated')}</Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>{t('privacy.informationCollection.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.informationCollection.content')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.howWeUse.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.howWeUse.content')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.dataProtection.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.dataProtection.content')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.thirdParty.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.thirdParty.content')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.yourRights.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.yourRights.content')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.changes.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.changes.content')}</Text>

          <Text style={styles.sectionTitle}>{t('privacy.contact.title')}</Text>
          <Text style={styles.sectionText}>{t('privacy.contact.content')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheaderText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  contentSection: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
    marginTop: 24,
  },
  sectionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
});