import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/constants/Colors';
import { ChevronDown, Check } from 'lucide-react-native';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Vehicle {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  image?: string;
  nickname?: string;
}

export function VehicleSelector() {
  const { session } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchVehicles();
    }
  }, [session]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error.message);
      } else {
        const vehicleData = data.map(vehicle => ({
          id: vehicle.id,
          name: vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
        }));
        
        setVehicles(vehicleData);
        
        // Set first vehicle as selected by default
        if (vehicleData.length > 0 && !selectedVehicle) {
          setSelectedVehicle(vehicleData[0]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.accent} />
      </View>
    );
  }

  if (!selectedVehicle) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No vehicles found</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: selectedVehicle.image }}
          style={styles.vehicleImage}
        />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
          <Text style={styles.vehicleDetails}>
            {selectedVehicle.year} {selectedVehicle.make}{' '}
            {selectedVehicle.model}
          </Text>
        </View>
        <ChevronDown size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vehicle</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.vehicleItem}
                  onPress={() => handleSelectVehicle(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.vehicleItemImage}
                  />
                  <View style={styles.vehicleItemInfo}>
                    <Text style={styles.vehicleItemName}>{item.name}</Text>
                    <Text style={styles.vehicleItemDetails}>
                      {item.year} {item.make} {item.model}
                    </Text>
                  </View>
                  {selectedVehicle.id === item.id && (
                    <View style={styles.checkIcon}>
                      <Check size={20} color={Colors.accent} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.vehiclesList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  emptyText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  vehicleDetails: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  modalTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.accent,
  },
  vehiclesList: {
    paddingVertical: 8,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  vehicleItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  vehicleItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleItemName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  vehicleItemDetails: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
