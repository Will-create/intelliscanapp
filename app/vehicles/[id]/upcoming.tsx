import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Clock,
  MapPin,
  Wrench,
} from 'lucide-react-native';
import { supabase } from '@/utils/supabase';

export default function UpcomingMaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, [id]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select(`
          id,
          service_type,
          scheduled_date,
          status,
          notes,
          mileage_at_schedule
        `)
        .eq('vehicle_id', id)
        .eq('status', 'scheduled')
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching schedules:', error.message);
        return;
      }

      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return Colors.accent;
      case 'overdue':
        return Colors.error;
      default:
        return Colors.text;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('upcoming.title')}</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('upcoming.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {schedules.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No upcoming maintenance</Text>
            <Text style={styles.emptySubtext}>
              Schedule your next maintenance to keep your vehicle running smoothly
            </Text>
          </View>
        ) : (
          <View style={styles.schedulesContainer}>
            {schedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleTypeContainer}>
                    <Wrench size={20} color={Colors.accent} />
                    <Text style={styles.scheduleType}>{schedule.service_type}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(schedule.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(schedule.status) },
                      ]}
                    >
                      {getStatusText(schedule.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.scheduleDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {new Date(schedule.scheduled_date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {schedule.mileage_at_schedule?.toLocaleString()} miles
                    </Text>
                  </View>
                </View>

                {schedule.notes && (
                  <Text style={styles.scheduleNotes}>{schedule.notes}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  schedulesContainer: {
    padding: 16,
  },
  scheduleCard: {
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleType: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  scheduleDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  scheduleNotes: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});