import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Star, MapPin } from 'lucide-react-native';

interface GarageListItemProps {
  garage: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    distance: number;
    isOpen: boolean;
    services: string[];
  };
  onPress: () => void;
  isSelected: boolean;
}

export function GarageListItem({ garage, onPress, isSelected }: GarageListItemProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.nameSection}>
          <Text style={styles.garageName}>{garage.name}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: garage.isOpen ? Colors.success + '20' : Colors.error + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: garage.isOpen ? Colors.success : Colors.error }
            ]}>
              {garage.isOpen ? t('garages.open') : t('garages.closed')}
            </Text>
          </View>
        </View>
        
        <View style={styles.ratingSection}>
          <Star size={16} color={Colors.accent} fill={Colors.accent} />
          <Text style={styles.ratingText}>
            {garage.rating} ({garage.reviews} {t('garages.reviews')})
          </Text>
        </View>
        
        <View style={styles.locationSection}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.distanceText}>{garage.distance} mi away</Text>
        </View>
        
        <View style={styles.servicesSection}>
          {garage.services.slice(0, 3).map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{service}</Text>
            </View>
          ))}
          {garage.services.length > 3 && (
            <Text style={styles.moreText}>+{garage.services.length - 3} more</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  content: {
    padding: 16,
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  garageName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    marginLeft: 8,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  servicesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  serviceTag: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceTagText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.text,
  },
  moreText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});