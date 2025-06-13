import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { TriangleAlert as AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react-native';

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
              {fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)} {t('diagnostics.severity')}
            </Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{fault.systemAffected}</Text>
          </View>
        </View>
      </View>
      
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedTitle}>{t('diagnostics.possibleCauses')}:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• {t('diagnostics.causes.sparkPlugs')}</Text>
            <Text style={styles.bulletItem}>• {t('diagnostics.causes.fuelInjectors')}</Text>
            <Text style={styles.bulletItem}>• {t('diagnostics.causes.ignitionCoil')}</Text>
            <Text style={styles.bulletItem}>• {t('diagnostics.causes.fuelPressure')}</Text>
          </View>
          
          <Text style={styles.expandedTitle}>{t('diagnostics.recommendedActions')}:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• {t('diagnostics.actions.inspectSparkPlugs')}</Text>
            <Text style={styles.bulletItem}>• {t('diagnostics.actions.checkFuelInjectors')}</Text>
            <Text style={styles.bulletItem}>• {t('diagnostics.actions.testIgnitionCoil')}</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{t('diagnostics.viewRepairGuide')}</Text>
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