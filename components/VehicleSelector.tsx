import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { ChevronDown, Check } from 'lucide-react-native';

export function VehicleSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({
    id: '1',
    name: 'Toyota Camry',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
  });
  
  const vehicles = [
    {
      id: '1',
      name: 'Toyota Camry',
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    },
    {
      id: '2',
      name: 'Honda Accord',
      make: 'Honda',
      model: 'Accord',
      year: 2017,
      image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg',
    },
    {
      id: '3',
      name: 'Ford F-150',
      make: 'Ford',
      model: 'F-150',
      year: 2020,
      image: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg',
    }
  ];
  
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Image source={{ uri: selectedVehicle.image }} style={styles.vehicleImage} />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
          <Text style={styles.vehicleDetails}>
            {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
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
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.vehicleItem}
                  onPress={() => handleSelectVehicle(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.vehicleItemImage} />
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