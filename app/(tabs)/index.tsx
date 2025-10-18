import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { VehicleCard } from '@/components/VehicleCard';
import { HealthStatus } from '@/components/HealthStatus';
import { MaintenanceReminder } from '@/components/MaintenanceReminder';
import { RecentActivity } from '@/components/RecentActivity';
import { 
  Gauge, 
  Wrench, 
  Calendar, 
  Car, 
  Plus,
  FileText
} from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase';

import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(85); // Default score

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
      } else {
        setProfile(profileData);
      }

      // Fetch vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', session?.user.id);

      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError.message);
      } else {
        setVehicles(vehiclesData || []);
      }

      // Fetch maintenance reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from('maintenance_schedules')
        .select(`
          id,
          scheduled_date,
          service_type,
          status,
          vehicles (nickname)
        `)
        .eq('status', 'scheduled')
        .limit(3);

      if (remindersError) {
        console.error('Error fetching reminders:', remindersError.message);
      } else {
        // Transform data for MaintenanceReminder component
        const transformedReminders = (remindersData || []).map(item => {
          const dueDate = new Date(item.scheduled_date);
          const today = new Date();
          const diffTime = dueDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            id: item.id,
            type: item.service_type,
            dueDate: item.scheduled_date,
            daysLeft: daysLeft,
            critical: daysLeft <= 3,
            vehicle: (item.vehicles as any)?.nickname || 'Vehicle'
          };
        });
        setReminders(transformedReminders);
      }

      // Mock recent activities (in a real app, this would come from the database)
      const mockActivities = [
        {
          id: '1',
          type: 'maintenance',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Oil change completed',
          issues: 0,
          Icon: Wrench,
          color: Colors.success,
        },
        {
          id: '2',
          type: 'diagnostic',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Diagnostic scan completed',
          issues: 2,
          Icon: FileText,
          color: Colors.warning,
        },
        {
          id: '3',
          type: 'service',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Brake inspection',
          issues: 0,
          Icon: Calendar,
          color: Colors.accent,
        },
      ];
      setActivities(mockActivities);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunDiagnostics = () => {
    router.push('/diagnostics');
  };

  const handleLogMaintenance = () => {
    if (vehicles.length > 0) {
      // Navigate to first vehicle's maintenance page
      router.push(`/vehicles/${vehicles[0].id}/maintenance`);
    } else {
      Alert.alert('No Vehicles', 'Please add a vehicle first');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('tabs.dashboard')}</Text>
        </View>

        <Text style={styles.welcomeMessage}>
          {t('auth.welcome')} {profile?.full_name || 'User'}
        </Text>

        {vehicles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('vehicles.myVehicles')}</Text>
            <FlatList
              data={vehicles}
              renderItem={({ item }) => <VehicleCard vehicle={item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.vehicleHealth')}</Text>
          <HealthStatus score={healthScore} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.upcomingMaintenance')}</Text>
            <TouchableOpacity onPress={() => router.push('/vehicles')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reminderContainer}>
            {reminders.length > 0 ? (
              reminders.map((reminder) => (
                <MaintenanceReminder key={reminder.id} item={reminder} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Calendar size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  No upcoming maintenance
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.recentActivity')}</Text>
          <View style={styles.activityContainer}>
            {activities.map((activity) => (
              <RecentActivity key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRunDiagnostics}
          >
            <Wrench size={20} color={Colors.white} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>{t('dashboard.runDiagnostics')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleLogMaintenance}
          >
            <Plus size={20} color={Colors.accent} style={styles.actionIcon} />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  welcomeMessage: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  seeAllText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.accent,
  },
  reminderContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyState: {
    backgroundColor: Colors.white,
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyStateText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  actionIcon: {
    marginRight: 8,
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
