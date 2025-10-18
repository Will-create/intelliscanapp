import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  User,
  FileText,
} from 'lucide-react-native';

export default function ContactSupportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert(t('contact.validationError'), t('contact.validationMessage'));
      return;
    }

    // In a real implementation, this would send the message to your support system
    console.log('Sending support request:', { name, email, subject, message });
    
    Alert.alert(
      t('contact.successTitle'),
      t('contact.successMessage'),
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('contact.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>{t('contact.header')}</Text>
          <Text style={styles.subheaderText}>{t('contact.subheader')}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <User size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('contact.namePlaceholder')}
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <Mail size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('contact.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <FileText size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('contact.subjectPlaceholder')}
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.textAreaGroup}>
            <View style={styles.inputIconContainer}>
              <MessageSquare size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('contact.messagePlaceholder')}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>{t('contact.sendButton')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{t('contact.alternativeTitle')}</Text>
          
          <View style={styles.contactOption}>
            <View style={styles.contactIconContainer}>
              <Mail size={24} color={Colors.accent} />
            </View>
            <View>
              <Text style={styles.contactLabel}>{t('contact.emailLabel')}</Text>
              <Text style={styles.contactValue}>{t('contact.emailValue')}</Text>
            </View>
          </View>

          <View style={styles.contactOption}>
            <View style={styles.contactIconContainer}>
              <Phone size={24} color={Colors.accent} />
            </View>
            <View>
              <Text style={styles.contactLabel}>{t('contact.phoneLabel')}</Text>
              <Text style={styles.contactValue}>{t('contact.phoneValue')}</Text>
            </View>
          </View>
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
    padding: 32,
    backgroundColor: Colors.white,
    marginBottom: 16,
    alignItems: 'center',
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
    lineHeight: 24,
  },
  formContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  textAreaGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  sendButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  contactInfo: {
    padding: 16,
  },
  contactTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
  },
});