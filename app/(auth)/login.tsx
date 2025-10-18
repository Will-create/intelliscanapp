import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { LanguageSelector } from '@/components/LanguageSelector';
const { width } = Dimensions.get('window');

import { signInWithGoogle, signInWithEmail } from '@/utils/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { error } = await signInWithEmail(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/(tabs)');
    }
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
            source={require('../../assets/images/icon.jpg')}
            style={styles.headerImage}
          />
          <View style={styles.overlay}></View>
          <View style={styles.headerContent}>
            <View style={styles.languageSelectorContainer}>
              <LanguageSelector />
            </View>
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

            <Link href="/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  {t('auth.signIn.forgotPassword')}
                </Text>
              </TouchableOpacity>
            </Link>

            {error ? <Text style={styles.errorText}>{t(error)}</Text> : null}

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

            <TouchableOpacity
              style={styles.button}
              onPress={signInWithGoogle}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('auth.signIn.google')}</Text>
              <ArrowRight size={20} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                {t('auth.signIn.noAccount')}{' '}
              </Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>
                    {t('auth.signIn.createAccount')}
                  </Text>
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
    height: 250,
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
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: -180,
    right: 0,
  },
  welcomeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 36,
    color: Colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  formHeader: {
    marginBottom: 28,
  },
  formTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 6,
  },
  formSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  inputIcon: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotPasswordText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.accent,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
    marginRight: 6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  dividerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginHorizontal: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 28,
  },
  signupText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: Colors.accent,
  },
  errorText: {
    color: Colors.error,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});
