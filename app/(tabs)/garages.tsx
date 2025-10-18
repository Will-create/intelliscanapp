import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';

// ... (imports)

import Colors from '@/constants/Colors';

// ... (imports)

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
} from 'lucide-react-native';
import { GarageListItem } from '@/components/GarageListItem';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase';

const MapPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.mapPlaceholder}>
      <MapPin size={32} color={Colors.accent} />
      <Text style={styles.mapPlaceholderText}>{t('garages.map')}</Text>
      <Text style={styles.mapPlaceholderSubtext}>
        Map integration available in native iOS/Android
      </Text>
    </View>
  );
};

export default function GaragesScreen() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [selectedView, setSelectedView] = useState('list');

  useEffect(() => {
    if (session) {
      const getGarages = async () => {
        const { data, error } = await supabase
          .from('garages')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching garages:', error.message);
        } else {
          setGarages(data);
        }
        setLoading(false);
      };

      getGarages();
    }
  }, [session]);

  const handleGarageSelect = (garage) => {
    setSelectedGarage(garage);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('garages.nearbyGarages')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>
            {t('garages.searchGarages')}
          </Text>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedView === 'list' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedView('list')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedView === 'list' && styles.toggleButtonTextActive,
              ]}
            >
              {t('garages.list')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedView === 'map' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedView('map')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedView === 'map' && styles.toggleButtonTextActive,
              ]}
            >
              {t('garages.map')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedView === 'map' ? (
        <MapPlaceholder />
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={garages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GarageListItem
                garage={item}
                onPress={() => handleGarageSelect(item)}
                isSelected={selectedGarage?.id === item.id}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {selectedGarage && (
        <View style={styles.garageDetailCard}>
          <View style={styles.garageDetailHeader}>
            <View>
              <Text style={styles.garageDetailName}>{selectedGarage.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color={Colors.accent} fill={Colors.accent} />
                <Text style={styles.ratingText}>
                  {selectedGarage.rating} ({selectedGarage.reviews}{' '}
                  {t('garages.reviews')})
                </Text>
              </View>
            </View>
            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: selectedGarage.isOpen
                      ? Colors.success + '20'
                      : Colors.error + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: selectedGarage.isOpen
                        ? Colors.success
                        : Colors.error,
                    },
                  ]}
                >
                  {selectedGarage.isOpen
                    ? t('garages.open')
                    : t('garages.closed')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.garageInfo}>
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{selectedGarage.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{selectedGarage.hours}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{selectedGarage.phone}</Text>
            </View>
          </View>

          <View style={styles.serviceContainer}>
            <Text style={styles.serviceTitle}>{t('garages.services')}</Text>
            <View style={styles.serviceTagsContainer}>
              {selectedGarage.services.map((service, index) => (
                <View key={index} style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>{t('garages.call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Navigation size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>
                {t('garages.directions')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchPlaceholder: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  toggleButtonTextActive: {
    color: Colors.text,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  mapPlaceholderText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 320,
  },
  garageDetailCard: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  garageDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  garageDetailName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  garageInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  serviceContainer: {
    marginBottom: 24,
  },
  serviceTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  serviceTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
});
