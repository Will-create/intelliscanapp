import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleSignup = () => {
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
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg' }}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
          <View style={styles.languageSelectorContainer}>
            <LanguageSelector />
          </View>
          <Text style={styles.title}>{t('auth.signUp.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.signUp.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.signUp.fullName')}
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.signUp.email')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.signUp.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>{t('auth.signUp.button')}</Text>
            <ArrowRight size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t('auth.signUp.haveAccount')} </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>{t('auth.signUp.signIn')}</Text>
              </TouchableOpacity>
            </Link>
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
    height: 300,
    justifyContent: 'flex-end',
    padding: 24,
    position: 'relative',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
  },
  form: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
    marginRight: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.accent,
  },
});