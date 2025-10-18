import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react-native';

interface DiagnosticCardProps {
  fault: {
    code: string;
    description: string;
    severity: string;
    systemAffected: string;
  };
}

export function DiagnosticCard({ fault }: DiagnosticCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.info;
      default:
        return Colors.warning;
    }
  };

  const severityColor = getSeverityColor(fault.severity);

  const fetchExplanation = async () => {
    if (explanation || loadingExplanation) return;
    
    setLoadingExplanation(true);
    try {
      // Call the edge function to get explanation
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/explain-diagnostic-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            code: fault.code,
            lang: 'en', // In a real app, this would be dynamic
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setExplanation(data.explanation || 'No explanation available.');
      setLoadingExplanation(false);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanation('Failed to load explanation. Please try again.');
      setLoadingExplanation(false);
    }
  };

  useEffect(() => {
    if (expanded && !explanation && !loadingExplanation) {
      fetchExplanation();
    }
  }, [expanded]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.codeSection}>
          <AlertTriangle size={20} color={severityColor} />
          <Text style={styles.codeText}>{fault.code}</Text>
        </View>
        <View style={styles.expandButton}>
          {expanded ? (
            <ChevronUp size={20} color={Colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={Colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>

      <View style={[styles.mainInfo, expanded && styles.mainInfoExpanded]}>
        <Text style={styles.descriptionText}>{fault.description}</Text>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: severityColor + '20' }]}>
            <Text style={[styles.tagText, { color: severityColor }]}>
              {fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)}{' '}
              {t('diagnostics.severity')}
            </Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{fault.systemAffected}</Text>
          </View>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          {loadingExplanation ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>{t('diagnostics.loadingExplanation')}</Text>
            </View>
          ) : explanation ? (
            <>
              <View style={styles.explanationContainer}>
                <Info size={16} color={Colors.textSecondary} />
                <Text style={styles.explanationTitle}>{t('diagnostics.explanation')}</Text>
              </View>
              <Text style={styles.explanationText}>{explanation}</Text>
            </>
          ) : null}

          <Text style={styles.expandedTitle}>
            {t('diagnostics.possibleCauses')}:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.causes.sparkPlugs')}
            </Text>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.causes.fuelInjectors')}
            </Text>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.causes.ignitionCoil')}
            </Text>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.causes.fuelPressure')}
            </Text>
          </View>

          <Text style={styles.expandedTitle}>
            {t('diagnostics.recommendedActions')}:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.actions.inspectSparkPlugs')}
            </Text>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.actions.checkFuelInjectors')}
            </Text>
            <Text style={styles.bulletItem}>
              • {t('diagnostics.actions.testIgnitionCoil')}
            </Text>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {t('diagnostics.viewRepairGuide')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  codeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  expandButton: {
    padding: 4,
  },
  mainInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  mainInfoExpanded: {
    paddingBottom: 8,
  },
  descriptionText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.text,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundSecondary,
    paddingTop: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  explanationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
  },
  explanationText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  expandedTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  bulletList: {
    marginBottom: 16,
  },
  bulletItem: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
  },
});
