import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { LanguageSelector } from '@/components/LanguageSelector';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg' }}
            style={styles.headerImage}
          />
          <View style={styles.overlay}>
            <View style={styles.gradientOverlay} />
          </View>
          <View style={styles.headerContent}>
            <View style={styles.languageSelectorContainer}>
              <LanguageSelector />
            </View>
            <Text style={styles.welcomeText}>{t('auth.welcome')}</Text>
            <Text style={styles.title}>{t('auth.appName')}</Text>
            <Text style={styles.subtitle}>{t('auth.tagline')}</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{t('auth.signIn.title')}</Text>
            <Text style={styles.formSubtitle}>{t('auth.signIn.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.signIn.email')}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.signIn.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('auth.signIn.forgotPassword')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('auth.signIn.button')}</Text>
              <ArrowRight size={20} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('common.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>{t('auth.signIn.noAccount')} </Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>{t('auth.signIn.createAccount')}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 340,
    position: 'relative',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: -240,
    right: 0,
  },
  welcomeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 42,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formHeader: {
    marginBottom: 32,
  },
  formTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  inputIcon: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.accent,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  dividerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginHorizontal: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  signupText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.accent,
  },
});