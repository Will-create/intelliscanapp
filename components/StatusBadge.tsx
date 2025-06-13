import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';

interface StatusBadgeProps {
  status: 'good' | 'warning' | 'critical';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'critical':
        return Colors.error;
      default:
        return Colors.success;
    }
  };

  const getStatusText = () => {
    return t(`common.status.${status}`);
  };

  const badgeColor = getStatusColor();
  const badgeText = getStatusText();

  return (
    <View style={[styles.badge, { backgroundColor: badgeColor + '20' }]}>
      <View style={[styles.dot, { backgroundColor: badgeColor }]} />
      <Text style={[styles.text, { color: badgeColor }]}>{badgeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  text: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
});