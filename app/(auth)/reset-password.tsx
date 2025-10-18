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
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Lock, ArrowRight } from 'lucide-react-native';
import { supabase } from '@/utils/supabase';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully');
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
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {t('auth.resetPassword.title')}
            </Text>
            <Text style={styles.formSubtitle}>
              {t('auth.resetPassword.subtitle')}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.signUp.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.resetPassword.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {error ? <Text style={styles.errorText}>{t(error)}</Text> : null}
            {message ? (
              <Text style={styles.messageText}>{t(message)}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={handlePasswordReset}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {t('auth.resetPassword.button')}
              </Text>
              <ArrowRight size={20} color={Colors.white} />
            </TouchableOpacity>
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
    height: 50,
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
  errorText: {
    color: Colors.error,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  messageText: {
    color: Colors.success,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});
