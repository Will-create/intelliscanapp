import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  X,
  Car,
  Calendar,
  Tag,
  Hash,
  Fuel,
  GitPullRequest,
  Gauge,
  Camera,
  DollarSign,
  FileText,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';

interface AddVehicleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: any) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isVisible,
  onClose,
  onAddVehicle,
}) => {
  const { t } = useTranslation();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vin, setVin] = useState('');
  const [nickname, setNickname] = useState('');
  const [mileage, setMileage] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      console.log('Starting image upload for URI:', uri);
      
      // Handle different URI formats for different platforms
      let fileUri = uri;
      if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
        fileUri = `file://${uri}`;
        console.log('Adjusted URI for iOS:', fileUri);
      }
      
      // Convert URI to blob
      console.log('Fetching image from URI:', fileUri);
      const response = await fetch(fileUri);
      console.log('Fetch response status:', response.status);
      const blob = await response.blob();
      console.log('Blob created. Size:', blob.size, 'Type:', blob.type);
      
      const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      console.log('Filename extracted:', filename);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        console.error(t('vehicles.addVehicle.error.userNotAuthenticated'));
        setError(t('vehicles.addVehicle.error.userNotAuthenticated'));
        return null;
      }
      const filePath = `${userId}/${Date.now()}_${filename}`;
      console.log('File path for upload:', filePath);

      const { data, error } = await supabase.storage
        .from('vehicle-images')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: blob.type || 'image/jpeg',
        });

      if (error) {
        console.error('Error uploading image:', error.message);
        setError(t('vehicles.addVehicle.error.uploadFailed'));
        return null;
      }

      console.log('Image uploaded successfully. Data:', data);
      const { data: publicUrlData } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(filePath);
      console.log('Public URL retrieved:', publicUrlData.publicUrl);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || t('vehicles.addVehicle.error.uploadFailed'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    // Validate required fields
    if (!make.trim() || !model.trim() || !year.trim()) {
      setError(t('vehicles.addVehicle.error.requiredFields'));
      return;
    }

    // Validate year format and range
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError(t('vehicles.addVehicle.error.invalidYear'));
      return;
    }

    // Validate mileage if provided
    if (mileage) {
      const mileageNum = parseInt(mileage);
      if (isNaN(mileageNum) || mileageNum < 0) {
        setError(t('vehicles.addVehicle.error.invalidMileage'));
        return;
      }
    }

    // Validate purchase price if provided
    if (purchasePrice) {
      const priceNum = parseFloat(purchasePrice);
      if (isNaN(priceNum) || priceNum < 0) {
        setError(t('vehicles.addVehicle.error.invalidPrice'));
        return;
      }
    }

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        return; // Error already handled in uploadImage
      }
    }

    const newVehicle = {
      make,
      model,
      year: parseInt(year),
      vin,
      nickname,
      mileage: mileage ? parseInt(mileage) : null,
      engine_size: engineSize,
      fuel_type: fuelType,
      transmission,
      color,
      license_plate: licensePlate,
      purchase_date: purchaseDate || null,
      purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
      notes,
      image: imageUrl,
    };
    
    onAddVehicle(newVehicle);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t('vehicles.addVehicle.title')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {uploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color={Colors.accent} />
                  <Text style={styles.uploadingText}>{t('vehicles.addVehicle.uploading')}</Text>
                </View>
              ) : image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={40} color={Colors.textSecondary} />
                  <Text style={styles.imagePlaceholderText}>
                    {t('vehicles.addVehicle.selectImage')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Car size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.make')}
                value={make}
                onChangeText={setMake}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Car size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.model')}
                value={model}
                onChangeText={setModel}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Calendar
                size={20}
                color={Colors.accent}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.year')}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Hash size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.vin')}
                value={vin}
                onChangeText={setVin}
                autoCapitalize="characters"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Tag size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.nickname')}
                value={nickname}
                onChangeText={setNickname}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Gauge size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.mileage')}
                value={mileage}
                onChangeText={setMileage}
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <GitPullRequest size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.engineSize')}
                value={engineSize}
                onChangeText={setEngineSize}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Fuel size={20} color={Colors.accent} style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  // Simple approach: cycle through common fuel types
                  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Ethanol'];
                  const currentIndex = fuelTypes.indexOf(fuelType);
                  const nextIndex = currentIndex === -1 || currentIndex === fuelTypes.length - 1 ? 0 : currentIndex + 1;
                  setFuelType(fuelTypes[nextIndex]);
                }}
              >
                <Text style={{ color: fuelType ? Colors.text : Colors.textSecondary }}>
                  {fuelType || t('vehicles.addVehicle.fuelType')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  // Simple approach: cycle through common transmission types
                  const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];
                  const currentIndex = transmissionTypes.indexOf(transmission);
                  const nextIndex = currentIndex === -1 || currentIndex === transmissionTypes.length - 1 ? 0 : currentIndex + 1;
                  setTransmission(transmissionTypes[nextIndex]);
                }}
              >
                <Text style={{ color: transmission ? Colors.text : Colors.textSecondary }}>
                  {transmission || t('vehicles.addVehicle.transmission')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.color')}
                value={color}
                onChangeText={setColor}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.licensePlate')}
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Calendar
                size={20}
                color={Colors.accent}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.purchaseDate')}
                value={purchaseDate}
                onChangeText={setPurchaseDate}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <DollarSign size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('vehicles.addVehicle.purchasePrice')}
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('vehicles.addVehicle.notes')}
                value={notes}
                onChangeText={setNotes}
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>
                {t('vehicles.addVehicle.button')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
  },
  closeButton: {
    padding: 5,
  },
  formScroll: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  inputIcon: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  addButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  errorText: {
    color: Colors.error,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  uploadingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginTop: 8,
  },
});
