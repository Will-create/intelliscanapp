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
import { Calendar, DollarSign, Wrench, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface RepairRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (repair: any) => void;
  repair?: any;
}

export default function RepairRecordModal({
  visible,
  onClose,
  onSave,
  repair,
}: RepairRecordModalProps) {
  const { t } = useTranslation();
  const [repairType, setRepairType] = useState(repair?.repair_type || '');
  const [repairDate, setRepairDate] = useState(repair?.repair_date || new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState(repair?.cost?.toString() || '');
  const [notes, setNotes] = useState(repair?.notes || '');
  const [garageId, setGarageId] = useState(repair?.garage_id?.toString() || '');
  const [serviceProvider, setServiceProvider] = useState(repair?.service_provider || '');
  const [mileageAtRepair, setMileageAtRepair] = useState(repair?.mileage_at_repair?.toString() || '');
  const [status, setStatus] = useState(repair?.status || 'completed');
  const [garageName, setGarageName] = useState(repair?.garage_name || '');
  const [garageAddress, setGarageAddress] = useState(repair?.garage_address || '');

  const handleSave = () => {
    if (!repairType || !repairDate) {
      Alert.alert(t('validation.error'), t('validation.requiredFields'));
      return;
    }

    const repairData = {
      repair_type: repairType,
      repair_date: repairDate,
      cost: cost ? parseFloat(cost) : null,
      notes: notes,
      garage_id: garageId ? parseInt(garageId) : null,
      service_provider: serviceProvider,
      mileage_at_repair: mileageAtRepair ? parseInt(mileageAtRepair) : null,
      status: status,
      garage_name: garageName,
      garage_address: garageAddress,
    };

    onSave(repairData);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {repair ? t('modals.repairRecord.title.edit') : t('modals.repairRecord.title.add')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.repairRecord.repairType')}</Text>
            <TextInput
              style={styles.input}
              value={repairType}
              onChangeText={setRepairType}
              placeholder={t('modals.repairRecord.repairTypePlaceholder')}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>{t('modals.repairRecord.repairDate')}</Text>
              <View style={styles.dateContainer}>
                <Calendar size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.dateInput}
                  value={repairDate}
                  onChangeText={setRepairDate}
                  placeholder={t('modals.maintenanceSchedule.scheduledDate')}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>{t('modals.repairRecord.status')}</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.pickerInput}
                  value={status}
                  onChangeText={setStatus}
                  placeholder={t('modals.repairRecord.statusPlaceholder')}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>{t('modals.repairRecord.cost')}</Text>
              <View style={styles.costContainer}>
                <DollarSign size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.costInput}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>{t('modals.repairRecord.mileageAtRepair')}</Text>
              <TextInput
                style={styles.input}
                value={mileageAtRepair}
                onChangeText={setMileageAtRepair}
                placeholder={t('modals.maintenanceSchedule.mileageAtSchedule')}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.repairRecord.serviceProvider')}</Text>
            <TextInput
              style={styles.input}
              value={serviceProvider}
              onChangeText={setServiceProvider}
              placeholder={t('modals.repairRecord.serviceProviderPlaceholder')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.repairRecord.serviceProvider')}</Text>
            <TextInput
              style={styles.input}
              value={serviceProvider}
              onChangeText={setServiceProvider}
              placeholder={t('modals.repairRecord.serviceProviderPlaceholder')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.repairRecord.notes')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('modals.repairRecord.notesPlaceholder')}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.repairRecord.garageName')}</Text>
            <TextInput
              style={styles.input}
              value={garageName}
              onChangeText={setGarageName}
              placeholder={t('modals.repairRecord.garageNamePlaceholder')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('modals.repairRecord.garageAddress')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={garageAddress}
              onChangeText={setGarageAddress}
              placeholder={t('modals.repairRecord.garageAddressPlaceholder')}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t('modals.repairRecord.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('modals.repairRecord.saveRepair')}</Text>
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
  row: {
    flexDirection: 'row',
    marginBottom: 16,
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
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
  },
  costInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pickerInput: {
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