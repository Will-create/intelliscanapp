import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { VehicleCard } from '@/components/VehicleCard';
import { HealthStatus } from '@/components/HealthStatus';
import { MaintenanceReminder } from '@/components/MaintenanceReminder';
import { RecentActivity } from '@/components/RecentActivity';
import { CircleAlert as AlertCircle, Check, Info } from 'lucide-react-native';

export default function DashboardScreen() {
  const { t } = useTranslation();
  
  // Mock data - would come from state/context in a real app
  const currentVehicle = {
    id: '1',
    name: 'My Toyota',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    healthScore: 87,
    mileage: 45280,
    lastCheck: '2023-09-15',
  };

  const maintenanceItems = [
    { id: '1', type: 'Oil Change', dueDate: '2023-10-15', daysLeft: 7, critical: false },
    { id: '2', type: 'Brake Inspection', dueDate: '2023-10-30', daysLeft: 22, critical: false },
    { id: '3', type: 'Tire Rotation', dueDate: '2023-10-10', daysLeft: 2, critical: true },
  ];

  const activities = [
    { 
      id: '1', 
      type: 'diagnostic', 
      date: '2023-10-08', 
      description: 'Engine Check', 
      issues: 2,
      Icon: AlertCircle,
      color: Colors.warning
    },
    { 
      id: '2', 
      type: 'maintenance', 
      date: '2023-09-25', 
      description: 'Oil Changed', 
      issues: 0,
      Icon: Check,
      color: Colors.success
    },
    { 
      id: '3', 
      type: 'info', 
      date: '2023-09-20', 
      description: 'Updated Vehicle Info', 
      issues: 0,
      Icon: Info,
      color: Colors.info
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('tabs.dashboard')}</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        <VehicleCard vehicle={currentVehicle} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.vehicleHealth')}</Text>
          <HealthStatus score={currentVehicle.healthScore} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.upcomingMaintenance')}</Text>
          <View style={styles.reminderContainer}>
            {maintenanceItems.map(item => (
              <MaintenanceReminder key={item.id} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.recentActivity')}</Text>
          <View style={styles.activityContainer}>
            {activities.map(activity => (
              <RecentActivity key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{t('dashboard.runDiagnostics')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              {t('dashboard.logMaintenance')}
            </Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: 12,
    color: Colors.text,
  },
  reminderContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActions: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  actionButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.accent,
  },
});