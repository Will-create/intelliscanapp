import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Calendar, Clock, Wrench, X } from 'lucide-react-native';
import { supabase } from '@/utils/supabase';
import { useTranslation } from 'react-i18next';

interface MaintenanceScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: any) => void;
  schedule?: any;
  vehicleId: string;
}

export default function MaintenanceScheduleModal({
  visible,
  onClose,
  onSave,
  schedule,
  vehicleId,
}: MaintenanceScheduleModalProps) {
  const { t } = useTranslation();
  const [serviceType, setServiceType] = useState(schedule?.service_type || '');
  const [scheduledDate, setScheduledDate] = useState(schedule?.scheduled_date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(schedule?.notes || '');
  const [mileageAtSchedule, setMileageAtSchedule] = useState(schedule?.mileage_at_schedule?.toString() || '');
  const [serviceProvider, setServiceProvider] = useState(schedule?.service_provider || '');
  const [garageId, setGarageId] = useState(schedule?.garage_id?.toString() || '');

  const handleSave = async () => {
    if (!serviceType || !scheduledDate) {
      Alert.alert(t('validation.error'), t('validation.requiredFields'));
      return;
    }

    const scheduleData = {
      service_type: serviceType,
      scheduled_date: scheduledDate,
      notes: notes,
      mileage_at_schedule: mileageAtSchedule ? parseInt(mileageAtSchedule) : null,
      service_provider: serviceProvider,
      garage_id: garageId ? parseInt(garageId) : null,
      status: 'scheduled',
    };

    try {
      if (schedule) {
        // Update existing schedule
        const { data, error } = await supabase
          .from('maintenance_schedules')
          .update(scheduleData)
          .eq('id', schedule.id)
          .select()
          .single();

        if (error) throw error;
        onSave(data);
      } else {
        // Create new schedule
        const { data, error } = await supabase
          .from('maintenance_schedules')
          .insert({
            ...scheduleData,
            vehicle_id: vehicleId,
          })
          .select()
          .single();

        if (error) throw error;
        onSave(data);
      }
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      Alert.alert(t('alerts.error'), error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {schedule ? t('modals.maintenanceSchedule.title.edit') : t('modals.maintenanceSchedule.title.add')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.maintenanceSchedule.serviceType')}</Text>
            <TextInput
              style={styles.input}
              value={serviceType}
              onChangeText={setServiceType}
              placeholder={t('modals.maintenanceSchedule.serviceTypePlaceholder')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.maintenanceSchedule.scheduledDate')}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.dateInput}
                value={scheduledDate}
                onChangeText={setScheduledDate}
                placeholder={t('modals.maintenanceSchedule.scheduledDate')}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.maintenanceSchedule.mileageAtSchedule')}</Text>
            <TextInput
              style={styles.input}
              value={mileageAtSchedule}
              onChangeText={setMileageAtSchedule}
              placeholder={t('modals.maintenanceSchedule.mileageAtSchedule')}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.maintenanceSchedule.serviceProvider')}</Text>
            <TextInput
              style={styles.input}
              value={serviceProvider}
              onChangeText={setServiceProvider}
              placeholder={t('modals.maintenanceSchedule.serviceProvider')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.maintenanceSchedule.garageId')}</Text>
            <TextInput
              style={styles.input}
              value={garageId}
              onChangeText={setGarageId}
              placeholder={t('modals.maintenanceSchedule.garageId')}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.maintenanceSchedule.notes')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('modals.maintenanceSchedule.notesPlaceholder')}
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t('modals.maintenanceSchedule.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('modals.maintenanceSchedule.saveSchedule')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundSecondary,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    marginLeft: 8,
  },
  saveButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
  },
});