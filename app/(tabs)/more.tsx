import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Link, useRouter } from 'expo-router';

import Colors from '@/constants/Colors';
import { BookOpen, ChevronRight, Settings, HelpCircle, FileCog, Bell, History, Gauge, MessageSquare, ShieldCheck, LogOut } from 'lucide-react-native';

export default function MoreScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('tabs.more')}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://media.licdn.com/dms/image/v2/D4E03AQGyrmYxD7MgaA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1719234187843?e=1755734400&v=beta&t=olkXB7gLxHFN5eLbaWaFJmlMlAwHS0NcpW_nYud9-8s' }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Apolos ZOMBRE</Text>
            <Text style={styles.profileEmail}>apoloszombre@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.profileEditButton}>
            <Text style={styles.profileEditButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('more.features')}</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f1f9ff' }]}>
                  <BookOpen size={20} color="#0077e6" />
                </View>
                <Text style={styles.menuItemText}>{t('more.repairTutorials')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fff5f5' }]}>
                  <History size={20} color="#e53935" />
                </View>
                <Text style={styles.menuItemText}>{t('more.maintenanceHistory')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fafef5' }]}>
                  <Gauge size={20} color="#7cb342" />
                </View>
                <Text style={styles.menuItemText}>{t('more.performanceReports')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef8f0' }]}>
                  <FileCog size={20} color="#f57c00" />
                </View>
                <Text style={styles.menuItemText}>{t('more.vehicleDocuments')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('more.preferences')}</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f5f5f5' }]}>
                  <Settings size={20} color="#616161" />
                </View>
                <Text style={styles.menuItemText}>{t('more.settings')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f1f9ff' }]}>
                  <Bell size={20} color="#0077e6" />
                </View>
                <Text style={styles.menuItemText}>{t('more.notifications')}</Text>
              </View>
              <Switch 
                trackColor={{ false: Colors.backgroundSecondary, true: Colors.accent + '50' }}
                thumbColor={true ? Colors.accent : '#f4f3f4'}
                value={true}
              />
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f0f4fa' }]}>
                  <ShieldCheck size={20} color="#3949ab" />
                </View>
                <Text style={styles.menuItemText}>{t('more.privacy')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('more.support')}</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f5f0fa' }]}>
                  <HelpCircle size={20} color="#8e24aa" />
                </View>
                <Text style={styles.menuItemText}>{t('more.helpCenter')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f0faf4' }]}>
                  <MessageSquare size={20} color="#43a047" />
                </View>
                <Text style={styles.menuItemText}>{t('more.contactSupport')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Link href="/login" asChild>
                            <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>{t('more.logout')}</Text>
        </TouchableOpacity>
              </Link>
   
        
        <Text style={styles.versionText}>{t('more.version')} 1.0.0</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profileEditButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 8,
  },
  profileEditButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.accent,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 12,
  },
  versionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});