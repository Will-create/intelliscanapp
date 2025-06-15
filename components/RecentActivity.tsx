import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
interface RecentActivityProps {
  activity: {
    id: string;
    type: string;
    date: string;
    description: string;
    issues: number;
    Icon: React.ComponentType<{ size: number; color: string; }>;
    color: string;
  };
}

export function RecentActivity({ activity }: RecentActivityProps) {
  const { t, i18n } = useTranslation();
  const { Icon } = activity;
  
  const formattedDate = new Date(activity.date).toLocaleDateString(
    i18n.language === 'fr' ? 'fr-FR' : 'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <TouchableOpacity style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: activity.color + '15' }]}>
        <Icon size={20} color={activity.color} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{activity.description}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      {activity.issues > 0 && (
        <View style={styles.issuesBadge}>
          <Text style={styles.issuesText}>{activity.issues}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  date: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  issuesBadge: {
    backgroundColor: Colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issuesText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: Colors.white,
  },
});