import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/utils/supabase';
import { useNotifications } from '@/hooks/useNotifications';

import Colors from '@/constants/Colors';
import {
  ChevronLeft,
  Bell,
  ShieldCheck,
  Globe,
  Palette,
  Moon,
  Sun,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile } = useProfile();
  const { notifications, updateNotificationPreference } = useNotifications();
  const [darkMode, setDarkMode] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(true);

  useEffect(() => {
    if (notifications) {
      setLocalNotifications(notifications.push_notifications);
    }
  }, [notifications]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO: Implement dark mode toggle
  };

  const toggleNotifications = async () => {
    const newValue = !localNotifications;
    setLocalNotifications(newValue);
    await updateNotificationPreference('push_notifications', newValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('more.settings')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f1f9ff' }]}>
                  <Bell size={20} color="#0077e6" />
                </View>
                <Text style={styles.menuItemText}>{t('more.notifications')}</Text>
              </View>
              <Switch
                trackColor={{
                  false: Colors.backgroundSecondary,
                  true: Colors.accent + '50',
                }}
                thumbColor={localNotifications ? Colors.accent : '#f4f3f4'}
                value={localNotifications}
                onValueChange={toggleNotifications}
              />
            </View>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f0f4fa' }]}>
                  <Moon size={20} color="#3949ab" />
                </View>
                <Text style={styles.menuItemText}>{t('settings.darkMode')}</Text>
              </View>
              <Switch
                trackColor={{
                  false: Colors.backgroundSecondary,
                  true: Colors.accent + '50',
                }}
                thumbColor={darkMode ? Colors.accent : '#f4f3f4'}
                value={darkMode}
                onValueChange={toggleDarkMode}
              />
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fff5f5' }]}>
                  <Globe size={20} color="#e53935" />
                </View>
                <Text style={styles.menuItemText}>{t('settings.language')}</Text>
              </View>
              <Text style={styles.menuItemValue}>English</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fafef5' }]}>
                  <ShieldCheck size={20} color="#7cb342" />
                </View>
                <Text style={styles.menuItemText}>{t('more.privacy')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef8f0' }]}>
                  <Palette size={20} color="#f57c00" />
                </View>
                <Text style={styles.menuItemText}>{t('settings.theme')}</Text>
              </View>
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  menuItemValue: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});