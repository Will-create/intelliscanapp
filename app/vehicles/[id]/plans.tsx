import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Plus,
  Wrench,
  Calendar,
  AlertTriangle,
} from 'lucide-react-native';
import MaintenancePlanModal from '@/components/MaintenancePlanModal';
import { supabase } from '@/utils/supabase';

export default function MaintenancePlansScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [plans, setPlans] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenancePlans();
  }, [id]);

  const fetchMaintenancePlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_plans')
        .select('*')
        .eq('vehicle_id', id);

      if (error) {
        console.error('Error fetching plans:', error.message);
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (planData: any) => {
    try {
      let result;
      if (editingPlan) {
        // Update existing plan
        const { data, error } = await supabase
          .from('maintenance_plans')
          .update(planData)
          .eq('id', editingPlan.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating plan:', error.message);
          Alert.alert('Error', 'Failed to update plan');
          return;
        }
        result = data;
      } else {
        // Add new plan
        const { data, error } = await supabase
          .from('maintenance_plans')
          .insert({
            ...planData,
            vehicle_id: id,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating plan:', error.message);
          Alert.alert('Error', 'Failed to create plan');
          return;
        }
        result = data;
      }

      // Refresh plans
      fetchMaintenancePlans();
      setModalVisible(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert('Error', 'Failed to save plan');
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setModalVisible(true);
  };

  const handleDeletePlan = (planId: string) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this maintenance plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('maintenance_plans')
                .delete()
                .eq('id', planId);

              if (error) {
                console.error('Error deleting plan:', error.message);
                Alert.alert('Error', 'Failed to delete plan');
                return;
              }

              // Refresh plans
              fetchMaintenancePlans();
            } catch (error) {
              console.error('Error deleting plan:', error);
              Alert.alert('Error', 'Failed to delete plan');
            }
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>{t('plans.title')}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingPlan(null);
              setModalVisible(true);
            }}
          >
            <Plus size={24} color={Colors.white} />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>{t('plans.title')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingPlan(null);
            setModalVisible(true);
          }}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Wrench size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No maintenance plans found</Text>
            <Text style={styles.emptySubtext}>
              Create your first maintenance plan to keep track of regular services
            </Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.plan_name}</Text>
                  <View style={styles.planStatus}>
                    <Text style={styles.planStatusText}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.planDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Service Type:</Text>
                    <Text style={styles.detailValue}>{plan.service_type}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Frequency:</Text>
                    <Text style={styles.detailValue}>
                      Every {plan.frequency_value} {plan.frequency_type}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start Date:</Text>
                    <Text style={styles.detailValue}>{plan.start_date}</Text>
                  </View>
                  
                  {plan.end_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>End Date:</Text>
                      <Text style={styles.detailValue}>{plan.end_date}</Text>
                    </View>
                  )}
                </View>
                
                {plan.notes && (
                  <Text style={styles.planNotes}>{plan.notes}</Text>
                )}
                
                <View style={styles.planActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditPlan(plan)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePlan(plan.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <MaintenancePlanModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        plan={editingPlan}
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
  plansContainer: {
    padding: 16,
  },
  planCard: {
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  planStatus: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  planStatusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.success,
  },
  planDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  planNotes: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: Colors.backgroundSecondary,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.text,
  },
});