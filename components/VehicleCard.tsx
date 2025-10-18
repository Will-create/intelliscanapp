import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { ChevronRight } from 'lucide-react-native';

interface VehicleCardProps {
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    nickname: string;
    mileage: number;
    image: string;
    created_at: string;
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const formattedDate = new Date(vehicle.created_at).toLocaleDateString(
    i18n.language === 'fr' ? 'fr-FR' : 'en-US',
    {
      month: 'short',
      day: 'numeric',
    },
  );

  const handlePress = () => {
    router.push(`/vehicles/${vehicle.id.toString()}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.vehicleName}>{vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}</Text>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </View>
        <Text style={styles.vehicleDetails}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {vehicle.mileage ? vehicle.mileage.toLocaleString() : 'N/A'}
            </Text>
            <Text style={styles.statLabel}>{t('common.miles')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formattedDate}</Text>
            <Text style={styles.statLabel}>{t('common.lastCheck')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  vehicleImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundSecondary,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.backgroundSecondary,
  },
  statValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
