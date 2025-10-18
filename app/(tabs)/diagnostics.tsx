import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  AlertCircle,
  CheckCircle,
  Bluetooth,
  RefreshCw,
  Wrench,
  Gauge,
} from 'lucide-react-native';
import { DiagnosticCard } from '@/components/DiagnosticCard';
import { VehicleSelector } from '@/components/VehicleSelector';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase';
import { obd2Service, DiagnosticCode, DiagnosticReport } from '@/services/obd2Service';

export default function DiagnosticsScreen() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [healthScore, setHealthScore] = useState(85);
  const [systemStatus, setSystemStatus] = useState({
    engine: 'Good',
    transmission: 'Good',
    brakes: 'Good',
    battery: 'Good',
  });
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkBluetoothStatus();
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
      }
    };
  }, []);

  const checkBluetoothStatus = async () => {
    const available = await obd2Service.isBluetoothAvailable();
    if (!available) {
      Alert.alert(
        t('diagnostics.bluetoothNotAvailable'),
        t('diagnostics.bluetoothNotAvailableMessage')
      );
    }
    setLoading(false);
  };

  const scanForDevices = async () => {
    setLoading(true);
    try {
      const foundDevices = await obd2Service.scanForDevices();
      setDevices(foundDevices);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for devices');
    } finally {
      setLoading(false);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    setLoading(true);
    try {
      const success = await obd2Service.connectToDevice(deviceId);
      if (success) {
        setIsConnected(true);
        setSelectedDevice(deviceId);
      } else {
        Alert.alert('Error', 'Failed to connect to device');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const disconnectDevice = async () => {
    await obd2Service.disconnect();
    setIsConnected(false);
    setSelectedDevice(null);
    setDevices([]);
    
    // Stop monitoring if active
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    setMonitoring(false);
  };

  const runDiagnosticScan = async () => {
    if (!selectedDevice) return;
    
    setIsScanning(true);
    setProgress(0);
    
    // Simulate progress
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Mock vehicle ID for demonstration
      const mockVehicleId = 1;
      const report = await obd2Service.runFullDiagnostic(mockVehicleId);
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      setProgress(100);
      setDiagnosticReport(report);
      setHealthScore(report.healthScore);
      setSystemStatus({
        engine: report.systemStatus.engine,
        transmission: report.systemStatus.transmission,
        brakes: report.systemStatus.brakes,
        battery: report.systemStatus.battery,
      });
      
      // Save to database
      await saveDiagnosticReport(report);
    } catch (error) {
      Alert.alert('Error', 'Diagnostic scan failed');
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        setProgress(0);
      }, 1000);
    }
  };

  const startMonitoring = async () => {
    if (!isConnected || !selectedDevice) return;
    
    setMonitoring(true);
    
    // Simulate real-time monitoring
    monitoringInterval.current = setInterval(async () => {
      try {
        // In a real implementation, this would fetch real-time data from the OBD2 device
        // For demonstration, we'll simulate changing values
        
        // Randomly update one system status for demonstration
        const systems = ['engine', 'transmission', 'brakes', 'battery'];
        const randomSystem = systems[Math.floor(Math.random() * systems.length)];
        const statuses: ('Good' | 'Warning' | 'Critical')[] = ['Good', 'Warning', 'Critical'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        setSystemStatus(prev => ({
          ...prev,
          [randomSystem]: randomStatus
        }));
        
        // Update health score based on system statuses
        const newHealthScore = calculateHealthScoreFromSystemStatus();
        setHealthScore(newHealthScore);
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 5000);
  };

  const stopMonitoring = () => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    setMonitoring(false);
  };

  const calculateHealthScoreFromSystemStatus = (): number => {
    // Simple calculation based on system statuses
    let score = 100;
    
    if (systemStatus.engine === 'Critical') score -= 30;
    else if (systemStatus.engine === 'Warning') score -= 15;
    
    if (systemStatus.transmission === 'Critical') score -= 25;
    else if (systemStatus.transmission === 'Warning') score -= 12;
    
    if (systemStatus.brakes === 'Critical') score -= 40;
    else if (systemStatus.brakes === 'Warning') score -= 20;
    
    if (systemStatus.battery === 'Critical') score -= 20;
    else if (systemStatus.battery === 'Warning') score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const saveDiagnosticReport = async (report: DiagnosticReport) => {
    try {
      const { error } = await supabase
        .from('diagnostic_reports')
        .insert([
          {
            vehicle_id: report.vehicleId,
            user_id: session?.user.id,
            report_date: new Date().toISOString(),
            status: report.healthScore >= 80 ? 'Good' : report.healthScore >= 60 ? 'Warning' : 'Critical',
            report_data: {
              codes: report.codes,
              healthScore: report.healthScore,
              systemStatus: report.systemStatus,
            },
            notes: 'Diagnostic scan completed',
          }
        ]);
      
      if (error) {
        console.error('Error saving diagnostic report:', error.message);
      }
    } catch (error) {
      console.error('Error saving diagnostic report:', error);
    }
  };

  const resetScan = () => {
    setDiagnosticReport(null);
    setProgress(0);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Good') return Colors.success;
    if (status === 'Warning' || status === 'Attention Required')
      return Colors.warning;
    return Colors.error;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>{t('diagnostics.connecting')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('diagnostics.title')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <VehicleSelector />

        {/* OBD Connection Card */}
        <View style={styles.connectionCard}>
          <Text style={styles.connectionTitle}>{t('diagnostics.obdConnection')}</Text>
          
          <View style={styles.connectionStatus}>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: isConnected ? Colors.success : Colors.error }
              ]} 
            />
            <Text style={styles.connectionText}>
              {isConnected 
                ? `${t('diagnostics.connected')} OBD2 Device` 
                : t('diagnostics.notConnected')}
            </Text>
          </View>

          {!isConnected ? (
            <>
              {devices.length > 0 ? (
                <>
                  {devices.map((device) => (
                    <TouchableOpacity
                      key={device.id}
                      style={styles.connectionButton}
                      onPress={() => connectToDevice(device.id)}
                    >
                      <Bluetooth size={20} color={Colors.white} />
                      <Text style={styles.buttonText}>{device.name}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.connectionButton, { marginTop: 12 }]}
                    onPress={scanForDevices}
                  >
                    <RefreshCw size={20} color={Colors.white} />
                    <Text style={styles.buttonText}>{t('diagnostics.refresh')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.connectionButton}
                  onPress={scanForDevices}
                >
                  <Bluetooth size={20} color={Colors.white} />
                  <Text style={styles.buttonText}>{t('diagnostics.connectToOBD')}</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.connectedActions}>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={runDiagnosticScan}
                disabled={isScanning}
              >
                <Gauge size={20} color={Colors.white} />
                <Text style={styles.buttonText}>
                  {isScanning ? t('diagnostics.scanning') : t('diagnostics.runDiagnostic')}
                </Text>
              </TouchableOpacity>
              
              {diagnosticReport && (
                <TouchableOpacity
                  style={[styles.connectionButton, { marginTop: 12 }]}
                  onPress={monitoring ? stopMonitoring : startMonitoring}
                >
                  <Text style={styles.buttonText}>
                    {monitoring ? t('diagnostics.stopMonitoring') : t('diagnostics.startMonitoring')}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.connectionButton, { marginTop: 12 }]}
                onPress={disconnectDevice}
              >
                <Text style={styles.buttonText}>{t('diagnostics.disconnect')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Scan Progress */}
        {isScanning && (
          <View style={styles.scanProgress}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.scanProgressText}>{t('diagnostics.scanning')}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.scanProgressText}>{progress}%</Text>
          </View>
        )}

        {/* Diagnostic Results */}
        {diagnosticReport && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{t('diagnostics.diagnosticResults')}</Text>
              <TouchableOpacity onPress={resetScan}>
                <Text style={styles.resetButton}>{t('diagnostics.newScan')}</Text>
              </TouchableOpacity>
            </View>

            {/* Health Score */}
            <View style={styles.healthScoreCard}>
              <AlertCircle size={40} color={getHealthColor(healthScore)} />
              <View style={styles.healthInfo}>
                <Text style={styles.healthScoreLabel}>{t('common.healthScore')}</Text>
                <Text 
                  style={[
                    styles.healthScoreValue, 
                    { color: getHealthColor(healthScore) }
                  ]}
                >
                  {healthScore}/100
                </Text>
              </View>
            </View>

            {/* Detected Issues */}
            {diagnosticReport.codes.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  {t('diagnostics.detectedIssues')} ({diagnosticReport.codes.length})
                </Text>
                {diagnosticReport.codes.map((code, index) => (
                  <DiagnosticCard key={index} fault={code} />
                ))}
              </>
            )}

            {/* System Status */}
            <Text style={styles.sectionTitle}>{t('diagnostics.systemStatus')}</Text>
            <View style={styles.systemStatusContainer}>
              {Object.entries(systemStatus).map(([system, status]) => (
                <View key={system} style={styles.systemItem}>
                  <View 
                    style={[
                      styles.systemStatusDot, 
                      { backgroundColor: getStatusColor(status) }
                    ]} 
                  />
                  <Text style={styles.systemName}>
                    {system.charAt(0).toUpperCase() + system.slice(1)}
                  </Text>
                  <Text 
                    style={[
                      styles.systemStatus, 
                      { color: getStatusColor(status) }
                    ]}
                  >
                    {t(`common.status.${status.toLowerCase()}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  connectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  connectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  connectionButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scanButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
  connectedActions: {
    marginTop: 8,
  },
  scanProgress: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scanProgressText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.text,
  },
  resetButton: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.accent,
  },
  healthScoreCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  healthInfo: {
    marginLeft: 16,
  },
  healthScoreLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  healthScoreValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  systemStatusContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  systemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  systemStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  systemName: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  systemStatus: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
});
