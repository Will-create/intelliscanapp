import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Gauge, AlertTriangle, Clock, PlusCircle } from 'lucide-react-native';
import { StatusBadge } from '@/components/StatusBadge';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase';

import { AddVehicleModal } from '@/components/AddVehicleModal';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  nickname?: string;
  mileage?: number;
  image?: string;
}

export default function VehiclesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (session) {
      const getVehicles = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', session.user.id);

          if (error) {
            console.error('Error fetching vehicles:', error.message);
            Alert.alert('Error', 'Failed to fetch vehicles');
            return;
          }

          setVehicles(data || []);
        } catch (error: any) {
          console.error('Error fetching vehicles:', error);
          Alert.alert('Error', error.message || 'Failed to fetch vehicles');
        } finally {
          setLoading(false);
        }
      };

      getVehicles();
    }
  }, [session]);

  const handleAddVehicle = async (newVehicle: any) => {
    if (!session) return;

    try {
      const mileageValue = newVehicle.mileage
        ? parseInt(newVehicle.mileage)
        : null;

      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...newVehicle,
          mileage: mileageValue,
          user_id: session.user.id,
        })
        .select();
        
      if (error) {
        console.error('Error adding vehicle:', error.message);
        Alert.alert('Error', 'Failed to add vehicle');
        return;
      }
      
      if (data) {
        setVehicles((prev) => [...prev, data[0]]);
      }
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', error.message || 'Failed to add vehicle');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const renderVehicleCard = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      style={styles.vehicleCard}
      onPress={() => router.push(`/vehicles/${item.id}`)}
    >
      <Image 
        source={{ uri: item.image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg' }} 
        style={styles.vehicleImage} 
      />
      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleHeader}>
          <Text style={styles.vehicleName}>
            {item.nickname || `${item.year} ${item.make} ${item.model}`}
          </Text>
        </View>
        <Text style={styles.vehicleDetails}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.mileage}>
          {item.mileage ? item.mileage.toLocaleString() : 'N/A'}{' '}
          {t('common.miles')}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Gauge size={16} color={Colors.success} />
            <Text style={styles.statText}>
              {t('common.healthScore')}: 95%
            </Text>
          </View>

          <View style={styles.statItem}>
            <AlertTriangle size={16} color={Colors.warning} />
            <Text style={styles.statText}>
              0 {t('vehicles.issues')}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Clock size={16} color={Colors.accent} />
            <Text style={styles.statText}>
              {t('vehicles.serviceRequired')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('vehicles.myVehicles')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <PlusCircle size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('vehicles.noVehicles')}</Text>
            <Text style={styles.emptySubtext}>{t('vehicles.addFirstVehicle')}</Text>
          </View>
        }
      />

      <AddVehicleModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddVehicle={handleAddVehicle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  vehicleCard: {
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
  vehicleImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  vehicleDetails: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  mileage: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});
