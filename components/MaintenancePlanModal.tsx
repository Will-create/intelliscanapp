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

interface MaintenancePlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (plan: any) => void;
  plan?: any;
}

export default function MaintenancePlanModal({
  visible,
  onClose,
  onSave,
  plan,
}: MaintenancePlanModalProps) {
  const [planName, setPlanName] = useState(plan?.plan_name || '');
  const [serviceType, setServiceType] = useState(plan?.service_type || '');
  const [frequencyType, setFrequencyType] = useState(plan?.frequency_type || 'months');
  const [frequencyValue, setFrequencyValue] = useState(plan?.frequency_value?.toString() || '');
  const [startDate, setStartDate] = useState(plan?.start_date || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(plan?.end_date || '');
  const [notes, setNotes] = useState(plan?.notes || '');
  const [active, setActive] = useState(plan?.active !== undefined ? plan.active : true);

  const handleSave = () => {
    if (!planName || !serviceType || !frequencyValue) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const planData = {
      plan_name: planName,
      service_type: serviceType,
      frequency_type: frequencyType,
      frequency_value: parseInt(frequencyValue),
      start_date: startDate,
      end_date: endDate || null,
      notes: notes,
      active: active,
    };

    onSave(planData);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {plan ? 'Edit Maintenance Plan' : 'Create Maintenance Plan'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plan Name *</Text>
            <TextInput
              style={styles.input}
              value={planName}
              onChangeText={setPlanName}
              placeholder="e.g., Oil Change Plan"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Type *</Text>
            <TextInput
              style={styles.input}
              value={serviceType}
              onChangeText={setServiceType}
              placeholder="e.g., Oil Change, Tire Rotation"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Frequency Type</Text>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.pickerInput}
                  value={frequencyType}
                  onChangeText={setFrequencyType}
                  placeholder="e.g., months"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Frequency Value *</Text>
              <TextInput
                style={styles.input}
                value={frequencyValue}
                onChangeText={setFrequencyValue}
                placeholder="e.g., 3"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Start Date</Text>
              <View style={styles.dateContainer}>
                <Calendar size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>End Date (Optional)</Text>
              <View style={styles.dateContainer}>
                <Calendar size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.dateInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional details about this maintenance plan"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Active</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={[styles.checkbox, active && styles.checkboxChecked]}
                onPress={() => setActive(!active)}
              >
                {active && <View style={styles.checkboxInner} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Plan is active</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Plan</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  checkboxLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text,
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