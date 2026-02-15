import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, TextStyle, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '@propflow/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { propertyApi } from '../../api/property';
import { useWebSocket } from '../../providers/WebSocketProvider';

export const StatusScreen = ({ navigation }: RootStackScreenProps<'Status'>) => {
  const logout = useAuthStore((state) => state.logout);
  const { draft, resetDraft } = usePropertyStore();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lastMessage } = useWebSocket();

  const fetchStatus = async () => {
    if (!draft.property_id) return;
    try {
      const data = await propertyApi.getProperty(draft.property_id);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Disable hardware back button on Android to prevent going back to summary
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'property:updated' && lastMessage?.property_id === draft.property_id) {
      fetchStatus();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [lastMessage, draft.property_id]);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetDraft();
    navigation.popToTop();
  };

  const getStatusDisplay = () => {
    if (!property) return { title: 'Request Submitted!', subtitle: 'Your request is being processed.' };
    
    switch (property.status) {
      case 'SUBMITTED':
        return { 
          title: 'Waiting for Review', 
          subtitle: 'A valuer will start reviewing your property shortly.' 
        };
      case 'UNDER_REVIEW':
        return { 
          title: 'Under Review', 
          subtitle: 'A valuer is currently reviewing your property details.' 
        };
      case 'VALUED':
        return { 
          title: 'Valuation Complete!', 
          subtitle: `Your property has been valued at ₹${property.estimated_value?.toLocaleString()}.` 
        };
      case 'FOLLOW_UP':
        return { 
          title: 'Action Required', 
          subtitle: property.valuer_notes || 'The valuer needs more information.' 
        };
      case 'REJECTED':
        return { 
          title: 'Request Rejected', 
          subtitle: property.valuer_notes || 'Your request could not be processed.' 
        };
      default:
        return { title: 'Request Submitted!', subtitle: 'Your request is being processed.' };
    }
  };

  const { title, subtitle } = getStatusDisplay();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content} accessibilityRole="none">
        <View 
          style={styles.successIconContainer}
          accessible={true}
          accessibilityLabel={property?.status === 'VALUED' ? "Success: Valuation Complete" : "Pending: Property under review"}
        >
          <Ionicons 
            name={property?.status === 'VALUED' ? "checkmark-circle" : "time-outline"} 
            size={100} 
            color={property?.status === 'VALUED' ? colors.success : colors.primary[500]} 
          />
        </View>
        
        <Text 
          style={styles.title} 
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
        >
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View 
          style={styles.infoCard} 
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Status History"
        >
          <Text style={styles.infoTitle} accessibilityRole="header">Status History</Text>
          <View style={styles.infoRow} accessible={true} accessibilityLabel="Request Submitted: Completed">
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={styles.infoText}>Request Submitted</Text>
          </View>
          {property?.status !== 'SUBMITTED' && (
            <View 
              style={styles.infoRow} 
              accessible={true} 
              accessibilityLabel={`Under Review: ${property?.status === 'UNDER_REVIEW' ? 'In Progress' : 'Completed'}`}
            >
              <View style={[styles.dot, { backgroundColor: property?.status === 'UNDER_REVIEW' ? colors.primary[500] : colors.success }]} />
              <Text style={styles.infoText}>Under Review</Text>
            </View>
          )}
          {property?.status === 'VALUED' && (
            <View style={styles.infoRow} accessible={true} accessibilityLabel="Valuation Complete: Completed">
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <Text style={styles.infoText}>Valuation Complete</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.doneButton} 
          onPress={handleDone}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          accessibilityHint="Returns to the property selection screen"
        >
          <Text style={styles.doneButtonText}>Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Logout"
          accessibilityHint="Signs you out of your account"
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
  },
  successIconContainer: {
    marginBottom: spacing[6],
  },
  title: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    marginTop: spacing[4],
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    padding: spacing[6],
    marginTop: spacing[8],
    width: '100%',
  },
  infoTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.gray[800],
    marginBottom: spacing[4],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginRight: spacing[3],
  },
  infoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[700],
  },
  footer: {
    padding: spacing[6],
    paddingBottom: spacing[10],
  },
  doneButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[4],
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  doneButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
  },
  logoutButton: {
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
  },
});
