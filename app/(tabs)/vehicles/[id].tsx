import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { ArrowLeft, Settings, Calendar, PenTool as Tool, History, FileText } from 'lucide-react-native';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  // Mock data - would come from a real API/database
  const vehicle = {
    id: '1',
    name: 'Toyota Camry',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    mileage: 45280,
    vin: '1HGCM82633A123456',
    licensePlate: 'ABC 123',
    lastService: '2023-12-15',
    nextService: '2024-03-15',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Silver',
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
      route: `/vehicles/${id}/history`,
    },
    {
      icon: FileText,
      title: t('vehicles.documents'),
      subtitle: t('vehicles.viewDocuments'),
      route: `/vehicles/${id}/documents`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.vehicleDetails}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.mileage.toLocaleString()}</Text>
              <Text style={styles.statLabel}>{t('common.miles')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.fuelType}</Text>
              <Text style={styles.statLabel}>{t('vehicles.fuelType')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.transmission}</Text>
              <Text style={styles.statLabel}>{t('vehicles.transmission')}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN</Text>
              <Text style={styles.detailValue}>{vehicle.vin}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('vehicles.licensePlate')}</Text>
              <Text style={styles.detailValue}>{vehicle.licensePlate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('vehicles.color')}</Text>
              <Text style={styles.detailValue}>{vehicle.color}</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route)}
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