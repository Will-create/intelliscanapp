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
  PenTool as Tool,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react-native';
import MaintenanceScheduleModal from '@/components/MaintenanceScheduleModal';
import { supabase } from '@/utils/supabase';

export default function MaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [maintenanceItems, setMaintenanceItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceItems();
  }, [id]);

  const fetchMaintenanceItems = async () => {
    try {
      setLoading(true);
      
      // Fetch maintenance schedules from Supabase
      const { data: schedules, error: schedulesError } = await supabase
        .from('maintenance_schedules')
        .select('*')
        .eq('vehicle_id', id)
        .order('scheduled_date', { ascending: true });

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError.message);
        return;
      }

      // Fetch maintenance plans from Supabase
      const { data: plans, error: plansError } = await supabase
        .from('maintenance_plans')
        .select('*')
        .eq('vehicle_id', id);

      if (plansError) {
        console.error('Error fetching plans:', plansError.message);
        return;
      }

      // Combine schedules and plans into maintenance items
      const items = [
        ...schedules.map(schedule => ({
          id: schedule.id,
          type: schedule.service_type,
          dueDate: schedule.scheduled_date,
          status: schedule.status,
          mileage: schedule.mileage_at_schedule,
          description: schedule.notes || `Scheduled ${schedule.service_type}`,
          estimatedCost: null,
          itemType: 'schedule',
          data: schedule,
        })),
        ...plans.map(plan => ({
          id: `plan-${plan.id}`,
          type: plan.service_type,
          dueDate: plan.start_date,
          status: plan.active ? 'active' : 'inactive',
          mileage: null,
          description: plan.notes || `Maintenance plan: ${plan.plan_name}`,
          estimatedCost: null,
          itemType: 'plan',
          data: plan,
        })),
      ];

      setMaintenanceItems(items);
    } catch (error) {
      console.error('Error fetching maintenance items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async (scheduleData: any) => {
    // Refresh the maintenance items
    fetchMaintenanceItems();
    setModalVisible(false);
    setEditingSchedule(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'active':
        return Colors.warning;
      case 'scheduled':
        return Colors.accent;
      case 'overdue':
      case 'inactive':
        return Colors.error;
      default:
        return Colors.text;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active Plan';
      case 'inactive':
        return 'Inactive Plan';
      default:
        return t(`maintenance.status.${status}`);
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
          <Text style={styles.headerTitle}>{t('maintenance.title')}</Text>
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
        <Text style={styles.headerTitle}>{t('maintenance.title')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingSchedule(null);
            setModalVisible(true);
          }}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('maintenance.upcoming')}</Text>
          {maintenanceItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Tool size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No maintenance items found</Text>
              <Text style={styles.emptySubtext}>
                Create your first maintenance schedule or plan
              </Text>
            </View>
          ) : (
            maintenanceItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.maintenanceCard}
                onPress={() => {
                  if (item.itemType === 'schedule') {
                    setEditingSchedule(item.data);
                    setModalVisible(true);
                  }
                }}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeContainer}>
                    <Tool size={20} color={Colors.accent} />
                    <Text style={styles.maintenanceType}>{item.type}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(item.status) },
                      ]}
                    >
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {item.mileage && (
                    <View style={styles.detailItem}>
                      <Clock size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {item.mileage.toLocaleString()} {t('common.miles')}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.description}>{item.description}</Text>

                {item.estimatedCost && (
                  <View style={styles.costContainer}>
                    <Text style={styles.costLabel}>
                      {t('maintenance.estimatedCost')}
                    </Text>
                    <Text style={styles.costValue}>
                      ${item.estimatedCost.toFixed(2)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity 
          style={styles.addButtonLarge}
          onPress={() => {
            setEditingSchedule(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>{t('maintenance.addNew')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MaintenanceScheduleModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSchedule(null);
        }}
        onSave={handleSaveSchedule}
        schedule={editingSchedule}
        vehicleId={id as string}
      />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
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
  },
  maintenanceCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceType: {
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
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  costLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  costValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  addButtonLarge: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.accent,
  },
});
