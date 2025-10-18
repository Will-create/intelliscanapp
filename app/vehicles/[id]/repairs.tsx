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
  DollarSign,
  Calendar,
  MapPin,
} from 'lucide-react-native';
import RepairRecordModal from '@/components/RepairRecordModal';
import { supabase } from '@/utils/supabase';

export default function RepairsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [repairs, setRepairs] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRepair, setEditingRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, [id]);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('repair_records')
        .select('*')
        .eq('vehicle_id', id)
        .order('repair_date', { ascending: false });

      if (error) {
        console.error('Error fetching repairs:', error.message);
        return;
      }

      setRepairs(data || []);
    } catch (error) {
      console.error('Error fetching repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRepair = async (repairData: any) => {
    try {
      let result;
      if (editingRepair) {
        // Update existing repair
        const { data, error } = await supabase
          .from('repair_records')
          .update(repairData)
          .eq('id', editingRepair.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating repair:', error.message);
          Alert.alert('Error', 'Failed to update repair');
          return;
        }
        result = data;
      } else {
        // Add new repair
        const { data, error } = await supabase
          .from('repair_records')
          .insert({
            ...repairData,
            vehicle_id: id,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating repair:', error.message);
          Alert.alert('Error', 'Failed to create repair');
          return;
        }
        result = data;
      }

      // Refresh repairs
      fetchRepairs();
      setModalVisible(false);
      setEditingRepair(null);
    } catch (error) {
      console.error('Error saving repair:', error);
      Alert.alert('Error', 'Failed to save repair');
    }
  };

  const handleEditRepair = (repair: any) => {
    setEditingRepair(repair);
    setModalVisible(true);
  };

  const handleDeleteRepair = (repairId: string) => {
    Alert.alert(
      'Delete Repair',
      'Are you sure you want to delete this repair record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('repair_records')
                .delete()
                .eq('id', repairId);

              if (error) {
                console.error('Error deleting repair:', error.message);
                Alert.alert('Error', 'Failed to delete repair');
                return;
              }

              // Refresh repairs
              fetchRepairs();
            } catch (error) {
              console.error('Error deleting repair:', error);
              Alert.alert('Error', 'Failed to delete repair');
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
          <Text style={styles.headerTitle}>{t('repairs.title')}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingRepair(null);
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
        <Text style={styles.headerTitle}>{t('repairs.title')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingRepair(null);
            setModalVisible(true);
          }}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {repairs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Wrench size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No repair records found</Text>
            <Text style={styles.emptySubtext}>
              Add repair records to keep track of vehicle maintenance history
            </Text>
          </View>
        ) : (
          <View style={styles.repairsContainer}>
            {repairs.map((repair) => (
              <View key={repair.id} style={styles.repairCard}>
                <View style={styles.repairHeader}>
                  <Text style={styles.repairType}>{repair.repair_type}</Text>
                  <Text style={styles.repairStatus}>{repair.status}</Text>
                </View>
                
                <View style={styles.repairDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {new Date(repair.repair_date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <DollarSign size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>${repair.cost?.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{repair.service_provider}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mileage:</Text>
                    <Text style={styles.detailValue}>
                      {repair.mileage_at_repair?.toLocaleString()} miles
                    </Text>
                  </View>
                </View>
                
                {repair.notes && (
                  <Text style={styles.repairNotes}>{repair.notes}</Text>
                )}
                
                <View style={styles.repairActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditRepair(repair)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRepair(repair.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <RepairRecordModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingRepair(null);
        }}
        onSave={handleSaveRepair}
        repair={editingRepair}
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
  repairsContainer: {
    padding: 16,
  },
  repairCard: {
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
  repairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  repairType: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  repairStatus: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.success,
  },
  repairDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  repairNotes: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  repairActions: {
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