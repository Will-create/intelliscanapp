import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Plus,
  FileText,
  Calendar,
  Download,
} from 'lucide-react-native';
import { supabase } from '@/utils/supabase';

export default function DocumentsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate documents since there's no specific documents table
      // In a real implementation, you would fetch from a documents table
      const mockDocuments = [
        {
          id: '1',
          name: 'Vehicle Registration',
          type: 'PDF',
          date: '2023-05-15',
          size: '2.4 MB',
        },
        {
          id: '2',
          name: 'Insurance Policy',
          type: 'PDF',
          date: '2023-06-20',
          size: '1.8 MB',
        },
        {
          id: '3',
          name: 'Service Manual',
          type: 'PDF',
          date: '2023-01-10',
          size: '5.2 MB',
        },
        {
          id: '4',
          name: 'Warranty Certificate',
          type: 'PDF',
          date: '2022-12-01',
          size: '3.1 MB',
        },
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = (documentId: string) => {
    Alert.alert(
      'Download Document',
      'This would download the selected document in a real implementation.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('documents.title')}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              Alert.alert(
                'Add Document',
                'This would open a file picker in a real implementation.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Plus size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('documents.title')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            Alert.alert(
              'Add Document',
              'This would open a file picker in a real implementation.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {documents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No documents found</Text>
            <Text style={styles.emptySubtext}>
              Add documents to keep track of your vehicle paperwork
            </Text>
          </View>
        ) : (
          <View style={styles.documentsContainer}>
            {documents.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentIconContainer}>
                    <FileText size={24} color={Colors.accent} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{document.name}</Text>
                    <Text style={styles.documentType}>{document.type}</Text>
                  </View>
                </View>
                
                <View style={styles.documentDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {new Date(document.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.documentSize}>{document.size}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownloadDocument(document.id)}
                >
                  <Download size={16} color={Colors.white} />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
    flex: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  documentsContainer: {
    padding: 16,
  },
  documentCard: {
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
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  documentType: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  documentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  documentSize: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
  },
  downloadButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
});