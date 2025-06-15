import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Gauge, AlertTriangle, Clock, PlusCircle } from 'lucide-react-native';
import { StatusBadge } from '@/components/StatusBadge';

export default function VehiclesScreen() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      name: 'Toyota Camry',
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
      healthScore: 87,
      mileage: 45280,
      status: 'good',
      issues: 0,
      maintenanceDue: false,
    },
    {
      id: '2',
      name: 'Honda Accord',
      make: 'Honda',
      model: 'Accord',
      year: 2017,
      image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg',
      healthScore: 65,
      mileage: 78500,
      status: 'warning',
      issues: 2,
      maintenanceDue: true,
    },
    {
      id: '3',
      name: 'Ford F-150',
      make: 'Ford',
      model: 'F-150',
      year: 2020,
      image: 'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg',
      healthScore: 92,
      mileage: 20150,
      status: 'good',
      issues: 0,
      maintenanceDue: false,
    }
  ]);

  const renderVehicleCard = ({ item }: any) => (
    <TouchableOpacity style={styles.vehicleCard}>
      <Image source={{ uri: item.image }} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleHeader}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.vehicleDetails}>{item.year} {item.make} {item.model}</Text>
        <Text style={styles.mileage}>{item.mileage.toLocaleString()} {t('common.miles')}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Gauge size={16} color={getHealthColor(item.healthScore)} />
            <Text style={styles.statText}>{t('common.healthScore')}: {item.healthScore}%</Text>
          </View>
          
          {item.issues > 0 && (
            <View style={styles.statItem}>
              <AlertTriangle size={16} color={Colors.warning} />
              <Text style={styles.statText}>{item.issues} {t('vehicles.issues')}</Text>
            </View>
          )}
          
          {item.maintenanceDue && (
            <View style={styles.statItem}>
              <Clock size={16} color={Colors.accent} />
              <Text style={styles.statText}>{t('vehicles.serviceRequired')}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getHealthColor = (score: any) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('vehicles.myVehicles')}</Text>
        <TouchableOpacity style={styles.addButton}>
          <PlusCircle size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehicles}
        renderItem={renderVehicleCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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