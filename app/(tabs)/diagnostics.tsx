import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Bluetooth, RefreshCw, Wrench, Gauge } from 'lucide-react-native';
import { DiagnosticCard } from '@/components/DiagnosticCard';
import { VehicleSelector } from '@/components/VehicleSelector';

export default function DiagnosticsScreen() {
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const connectTimeoutRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const spinAnimationRef = useRef(null);

  useEffect(() => {
    return () => {
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (spinAnimationRef.current) {
        spinAnimationRef.current.stop();
        spinValue.setValue(0);
      }
    };
  }, []);

  const connectToDevice = () => {
    setIsConnecting(true);
    
    connectTimeoutRef.current = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const startDiagnostic = () => {
    if (!isConnected) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    spinAnimationRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    );
    spinAnimationRef.current.start();
    
    scanIntervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 0.05;
        if (newProgress >= 1) {
          clearInterval(scanIntervalRef.current);
          setIsScanning(false);
          setDiagnosticResults({
            healthScore: 72,
            faults: [
              { 
                code: 'P0300', 
                description: 'Random/Multiple Cylinder Misfire Detected', 
                severity: 'high', 
                systemAffected: 'Engine' 
              },
              { 
                code: 'P0171', 
                description: 'System Too Lean (Bank 1)', 
                severity: 'medium', 
                systemAffected: 'Fuel System' 
              },
            ],
            systems: {
              engine: 'Attention Required',
              transmission: 'Good',
              brakes: 'Good',
              battery: 'Good',
              emissions: 'Warning'
            }
          });
          if (spinAnimationRef.current) {
            spinAnimationRef.current.stop();
            spinValue.setValue(0);
          }
          return 1;
        }
        return newProgress;
      });
    }, 200);
  };

  const resetDiagnostic = () => {
    setDiagnosticResults(null);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

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
        
        <View style={styles.connectionCard}>
          <Text style={styles.connectionTitle}>{t('diagnostics.obdConnection')}</Text>
          
          <View style={styles.connectionStatus}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isConnected ? Colors.success : Colors.error }
            ]} />
            <Text style={styles.connectionText}>
              {isConnected ? `${t('diagnostics.connected')} ELM327` : t('diagnostics.notConnected')}
            </Text>
          </View>
          
          {!isConnected ? (
            <TouchableOpacity 
              style={styles.connectionButton} 
              onPress={connectToDevice}
              disabled={isConnecting}
            >
              <Bluetooth size={20} color={Colors.white} />
              <Text style={styles.buttonText}>
                {isConnecting ? t('diagnostics.connecting') : t('diagnostics.connectToOBD')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.connectedActions}>
              {!isScanning && !diagnosticResults && (
                <TouchableOpacity 
                  style={styles.scanButton} 
                  onPress={startDiagnostic}
                >
                  <Wrench size={20} color={Colors.white} />
                  <Text style={styles.buttonText}>{t('diagnostics.runDiagnostic')}</Text>
                </TouchableOpacity>
              )}
              {isScanning && (
                <View style={styles.scanProgress}>
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <RefreshCw size={24} color={Colors.accent} />
                  </Animated.View>
                  <Text style={styles.scanProgressText}>
                    {t('diagnostics.scanning')} {Math.floor(scanProgress * 100)}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${scanProgress * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
                
        {diagnosticResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{t('diagnostics.diagnosticResults')}</Text>
              <TouchableOpacity onPress={resetDiagnostic}>
                <Text style={styles.resetButton}>{t('diagnostics.newScan')}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.healthScoreCard}>
              <Gauge size={32} color={getHealthColor(diagnosticResults.healthScore)} />
              <View style={styles.healthInfo}>
                <Text style={styles.healthScoreLabel}>{t('common.healthScore')}</Text>
                <Text style={[
                  styles.healthScoreValue,
                  { color: getHealthColor(diagnosticResults.healthScore) }
                ]}>
                  {diagnosticResults.healthScore}%
                </Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>{t('diagnostics.detectedIssues')}</Text>
            {diagnosticResults.faults.map((fault, index) => (
              <DiagnosticCard key={index} fault={fault} />
            ))}
            
            <Text style={styles.sectionTitle}>{t('diagnostics.systemStatus')}</Text>
            <View style={styles.systemStatusContainer}>
              {Object.entries(diagnosticResults.systems).map(([system, status]) => (
                <View key={system} style={styles.systemItem}>
                  <View style={[
                    styles.systemStatusDot,
                    { backgroundColor: getStatusColor(status) }
                  ]} />
                  <Text style={styles.systemName}>
                    {system.charAt(0).toUpperCase() + system.slice(1)}
                  </Text>
                  <Text style={[
                    styles.systemStatus,
                    { color: getStatusColor(status) }
                  ]}>
                    {status}
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

const getHealthColor = (score) => {
  if (score >= 80) return Colors.success;
  if (score >= 60) return Colors.warning;
  return Colors.error;
};

const getStatusColor = (status) => {
  if (status === 'Good') return Colors.success;
  if (status === 'Warning' || status === 'Attention Required') return Colors.warning;
  return Colors.error;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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