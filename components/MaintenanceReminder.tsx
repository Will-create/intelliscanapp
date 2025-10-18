import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { Calendar, ChevronRight } from 'lucide-react-native';

interface MaintenanceReminderProps {
  item: {
    id: string;
    type: string;
    dueDate: string;
    daysLeft: number;
    critical: boolean;
  };
}

export function MaintenanceReminder({ item }: MaintenanceReminderProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <Calendar
          size={20}
          color={item.critical ? Colors.error : Colors.accent}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.maintenanceType}>{item.type}</Text>
        <Text style={styles.dueDate}>
          {t('dashboard.daysLeft', {
            count: item.daysLeft,
            days:
              item.daysLeft === 1 ? t('dashboard.day') : t('dashboard.days'),
          })}
        </Text>
      </View>
      <ChevronRight size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  maintenanceType: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  dueDate: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
