import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  Phone,
} from 'lucide-react-native';

export default function HelpCenterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics = [
    {
      id: '1',
      title: t('help.gettingStarted.title'),
      description: t('help.gettingStarted.description'),
      icon: BookOpen,
    },
    {
      id: '2',
      title: t('help.vehicleSetup.title'),
      description: t('help.vehicleSetup.description'),
      icon: HelpCircle,
    },
    {
      id: '3',
      title: t('help.diagnostics.title'),
      description: t('help.diagnostics.description'),
      icon: MessageSquare,
    },
    {
      id: '4',
      title: t('help.maintenance.title'),
      description: t('help.maintenance.description'),
      icon: BookOpen,
    },
  ];

  const faqs = [
    {
      id: '1',
      question: t('help.faq.question1'),
      answer: t('help.faq.answer1'),
    },
    {
      id: '2',
      question: t('help.faq.question2'),
      answer: t('help.faq.answer2'),
    },
    {
      id: '3',
      question: t('help.faq.question3'),
      answer: t('help.faq.answer3'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('help.searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('help.browseTopics')}</Text>
          <View style={styles.topicsContainer}>
            {helpTopics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicCard}
                  onPress={() => {
                    // In a real implementation, this would navigate to the topic details
                    console.log('View topic:', topic.id);
                  }}
                >
                  <View style={styles.topicIconContainer}>
                    <IconComponent size={24} color={Colors.accent} />
                  </View>
                  <View style={styles.topicContent}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicDescription}>{topic.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('help.faq.title')}</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('help.contact.title')}</Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => {
                // In a real implementation, this would open email
                console.log('Send email');
              }}
            >
              <View style={styles.contactIconContainer}>
                <Mail size={24} color={Colors.accent} />
              </View>
              <Text style={styles.contactText}>{t('help.contact.email')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => {
                // In a real implementation, this would open phone
                console.log('Call support');
              }}
            >
              <View style={styles.contactIconContainer}>
                <Phone size={24} color={Colors.accent} />
              </View>
              <Text style={styles.contactText}>{t('help.contact.phone')}</Text>
            </TouchableOpacity>
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
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  topicsContainer: {
    paddingHorizontal: 16,
  },
  topicCard: {
    flexDirection: 'row',
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
  topicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  topicDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  faqContainer: {
    paddingHorizontal: 16,
  },
  faqItem: {
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
  faqQuestion: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactContainer: {
    paddingHorizontal: 16,
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
  contactText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
  },
});