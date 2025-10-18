import React, { useState } from 'react';
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
import {
  ArrowLeft,
  Play,
  Clock,
  Star,
  BookOpen,
} from 'lucide-react-native';

export default function TutorialsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tutorials] = useState([
    {
      id: '1',
      title: 'How to Change Engine Oil',
      duration: '12 min',
      difficulty: 'Beginner',
      rating: 4.8,
      views: '12.5K',
    },
    {
      id: '2',
      title: 'Replacing Brake Pads',
      duration: '25 min',
      difficulty: 'Intermediate',
      rating: 4.6,
      views: '8.3K',
    },
    {
      id: '3',
      title: 'Checking and Topping Up Coolant',
      duration: '8 min',
      difficulty: 'Beginner',
      rating: 4.7,
      views: '6.7K',
    },
    {
      id: '4',
      title: 'Replacing Air Filter',
      duration: '10 min',
      difficulty: 'Beginner',
      rating: 4.5,
      views: '9.2K',
    },
    {
      id: '5',
      title: 'Changing Spark Plugs',
      duration: '18 min',
      difficulty: 'Intermediate',
      rating: 4.4,
      views: '11.8K',
    },
    {
      id: '6',
      title: 'Replacing Battery',
      duration: '15 min',
      difficulty: 'Beginner',
      rating: 4.9,
      views: '15.4K',
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return Colors.success;
      case 'Intermediate':
        return Colors.warning;
      case 'Advanced':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
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
        <Text style={styles.headerTitle}>{t('tutorials.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tutorialsContainer}>
          {tutorials.map((tutorial) => (
            <TouchableOpacity
              key={tutorial.id}
              style={styles.tutorialCard}
              onPress={() => {
                // In a real implementation, this would navigate to the tutorial details
                console.log('View tutorial:', tutorial.id);
              }}
            >
              <View style={styles.tutorialThumbnail}>
                <View style={styles.thumbnailOverlay}>
                  <Play size={32} color={Colors.white} />
                </View>
              </View>
              
              <View style={styles.tutorialInfo}>
                <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                
                <View style={styles.tutorialMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{tutorial.duration}</Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <Star size={14} color={Colors.warning} />
                    <Text style={styles.metaText}>{tutorial.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.tutorialFooter}>
                  <Text style={[styles.difficulty, { color: getDifficultyColor(tutorial.difficulty) }]}>
                    {tutorial.difficulty}
                  </Text>
                  <Text style={styles.views}>{tutorial.views} views</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  tutorialsContainer: {
    padding: 16,
  },
  tutorialCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  tutorialThumbnail: {
    height: 180,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialInfo: {
    padding: 16,
  },
  tutorialTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  tutorialMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  tutorialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
  views: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});