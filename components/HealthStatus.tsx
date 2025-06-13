import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';

interface HealthStatusProps {
  score: number;
}

export function HealthStatus({ score }: HealthStatusProps) {
  const { t } = useTranslation();

  const getHealthColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return t('common.status.good');
    if (score >= 60) return t('common.status.warning');
    return t('common.status.critical');
  };

  const fillWidth = `${score}%`;
  const healthColor = getHealthColor(score);
  const healthStatus = getHealthStatus(score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreLabel}>{t('common.healthScore')}</Text>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: healthColor }]}>{score}</Text>
        </View>
      </View>
      
      <View style={styles.statusInfo}>
        <Text style={[styles.statusText, { color: healthColor }]}>
          {healthStatus}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: fillWidth, backgroundColor: healthColor }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  statusInfo: {
    marginBottom: 16,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});