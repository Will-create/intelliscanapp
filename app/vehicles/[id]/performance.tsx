import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react-native';
import { supabase } from '@/utils/supabase';

export default function PerformanceReportsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiagnosticReports();
  }, [id]);

  const fetchDiagnosticReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diagnostic_reports')
        .select('*')
        .eq('vehicle_id', id)
        .order('report_date', { ascending: false });

      if (error) {
        console.error('Error fetching diagnostic reports:', error.message);
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching diagnostic reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle size={20} color={Colors.success} />;
      case 'Warning':
        return <AlertTriangle size={20} color={Colors.warning} />;
      case 'Critical':
        return <AlertTriangle size={20} color={Colors.error} />;
      default:
        return <Info size={20} color={Colors.textSecondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return Colors.success;
      case 'Warning':
        return Colors.warning;
      case 'Critical':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
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
          <Text style={styles.headerTitle}>{t('performance.title')}</Text>
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
        <Text style={styles.headerTitle}>{t('performance.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Info size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No performance reports found</Text>
            <Text style={styles.emptySubtext}>
              Run a diagnostic scan to generate your first performance report
            </Text>
          </View>
        ) : (
          <View style={styles.reportsContainer}>
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => {
                  // In a real implementation, this would navigate to report details
                  console.log('View report details:', report.id);
                }}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(report.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(report.status) },
                      ]}
                    >
                      {report.status}
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>
                    {new Date(report.report_date).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.reportDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {new Date(report.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>
                
                {report.notes && (
                  <Text style={styles.reportNotes}>{report.notes}</Text>
                )}
              </TouchableOpacity>
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
  reportsContainer: {
    padding: 16,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
  reportDate: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  reportDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  reportNotes: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});