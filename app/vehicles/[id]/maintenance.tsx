import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { ArrowLeft, Calendar, PenTool as Tool, Clock,  AlertCircle } from 'lucide-react-native';

export default function MaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const maintenanceItems = [
    {
      id: '1',
      type: 'Oil Change',
      dueDate: '2024-02-15',
      status: 'upcoming',
      mileage: 50000,
      description: 'Regular oil change and filter replacement',
      estimatedCost: 89.99,
    },
    {
      id: '2',
      type: 'Brake Inspection',
      dueDate: '2024-02-28',
      status: 'scheduled',
      mileage: 51000,
      description: 'Comprehensive brake system inspection',
      estimatedCost: 149.99,
    },
    {
      id: '3',
      type: 'Tire Rotation',
      dueDate: '2024-02-10',
      status: 'overdue',
      mileage: 49500,
      description: 'Regular tire rotation service',
      estimatedCost: 59.99,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return Colors.warning;
      case 'scheduled':
        return Colors.accent;
      case 'overdue':
        return Colors.error;
      default:
        return Colors.text;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('maintenance.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('maintenance.upcoming')}</Text>
          {maintenanceItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.maintenanceCard}
              onPress={() => {}}
            >
              <View style={styles.cardHeader}>
                <View style={styles.typeContainer}>
                  <Tool size={20} color={Colors.accent} />
                  <Text style={styles.maintenanceType}>{item.type}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) }
                  ]}>
                    {t(`maintenance.status.${item.status}`)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {item.mileage.toLocaleString()} {t('common.miles')}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.costContainer}>
                <Text style={styles.costLabel}>{t('maintenance.estimatedCost')}</Text>
                <Text style={styles.costValue}>
                  ${item.estimatedCost.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>
                  {t('maintenance.schedule')}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>
            {t('maintenance.addNew')}
          </Text>
        </TouchableOpacity>
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
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  maintenanceCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceType: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
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
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  costLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  costValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  scheduleButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
  },
  addButton: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.accent,
  },
});