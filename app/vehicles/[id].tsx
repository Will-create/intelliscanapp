import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { EditVehicleModal } from '@/components/EditVehicleModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Settings,
  Calendar,
  PenTool as Tool,
  History,
  FileText,
} from 'lucide-react-native';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { session } = useAuth();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    if (session && id) {
      fetchVehicleDetails();
    }
  }, [session, id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching vehicle:', error.message);
        Alert.alert('Error', 'Failed to fetch vehicle details');
        return;
      }

      setVehicle(data);
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      Alert.alert('Error', error.message || 'Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVehicle = async (updatedVehicle: any) => {
    if (updatedVehicle === null) {
      // Vehicle was deleted
      router.back();
      return;
    }
    
    // Vehicle was updated
    setVehicle(updatedVehicle);
    setEditModalVisible(false);
  };

  const menuItems = [
    {
      icon: Calendar,
      title: t('vehicles.maintenance'),
      subtitle: t('vehicles.scheduleService'),
      route: `/vehicles/${id}/maintenance`,
    },
    {
      icon: Tool,
      title: t('vehicles.repairs'),
      subtitle: t('vehicles.repairHistory'),
      route: `/vehicles/${id}/repairs`,
    },
    {
      icon: History,
      title: t('vehicles.history'),
      subtitle: t('vehicles.serviceHistory'),
      route: `/vehicles/${id}/performance`,
    },
    {
      icon: FileText,
      title: t('vehicles.documents'),
      subtitle: t('vehicles.viewDocuments'),
      route: `/vehicles/${id}/documents`,
    },
  ];

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
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Vehicle not found</Text>
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
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setEditModalVisible(true)}
        >
          <Settings size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: vehicle.image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg' }} 
          style={styles.vehicleImage} 
        />

        <View style={styles.infoContainer}>
          <Text style={styles.vehicleName}>
            {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          </Text>
          <Text style={styles.vehicleDetails}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {vehicle.mileage ? vehicle.mileage.toLocaleString() : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>{t('common.miles')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.fuel_type || 'N/A'}</Text>
              <Text style={styles.statLabel}>{t('vehicles.fuelType')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.transmission || 'N/A'}</Text>
              <Text style={styles.statLabel}>{t('vehicles.transmission')}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN</Text>
              <Text style={styles.detailValue}>{vehicle.vin || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('vehicles.licensePlate')}
              </Text>
              <Text style={styles.detailValue}>{vehicle.license_plate || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('vehicles.color')}</Text>
              <Text style={styles.detailValue}>{vehicle.color || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('vehicles.engineSize')}</Text>
              <Text style={styles.detailValue}>{vehicle.engine_size || 'N/A'}</Text>
            </View>
            {vehicle.purchase_date && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('vehicles.purchaseDate')}</Text>
                <Text style={styles.detailValue}>
                  {new Date(vehicle.purchase_date).toLocaleDateString()}
                </Text>
              </View>
            )}
            {vehicle.purchase_price && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('vehicles.purchasePrice')}</Text>
                <Text style={styles.detailValue}>
                  ${vehicle.purchase_price.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {vehicle.notes && (
            <View style={styles.detailsContainer}>
              <Text style={styles.notesTitle}>{t('vehicles.notes')}</Text>
              <Text style={styles.notesText}>{vehicle.notes}</Text>
            </View>
          )}

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuIcon}>
                  <item.icon size={24} color={Colors.accent} />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <EditVehicleModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSaveVehicle={handleSaveVehicle}
        vehicle={vehicle}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.error,
  },
  vehicleImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 24,
  },
  vehicleName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  detailLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  notesTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  notesText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  menuContainer: {
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
