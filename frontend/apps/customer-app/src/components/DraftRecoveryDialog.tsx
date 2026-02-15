import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@propflow/theme';

interface DraftRecoveryDialogProps {
  visible: boolean;
  savedStep: number;
  onContinue: () => void;
  onStartOver: () => void;
}

const STEP_NAMES: Record<number, string> = {
  1: 'Property Type Selection',
  2: 'Property Details',
  3: 'Location',
  4: 'Photo Capture',
  5: 'Photo Review',
};

export const DraftRecoveryDialog: React.FC<DraftRecoveryDialogProps> = ({
  visible,
  savedStep,
  onContinue,
  onStartOver,
}) => {
  const stepName = STEP_NAMES[savedStep] || `Step ${savedStep}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💾</Text>
          </View>

          <Text style={styles.title}>Resume Your Progress?</Text>

          <Text style={styles.message}>
            We found your saved progress from <Text style={styles.highlight}>{stepName}</Text>.
            Would you like to continue from where you left off?
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={onContinue} activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>Continue from {stepName}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startOverButton}
            onPress={onStartOver}
            activeOpacity={0.8}
          >
            <Text style={styles.startOverButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[6],
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as any,
    color: colors.gray[900],
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 24,
  },
  highlight: {
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold as any,
  },
  continueButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: 8,
    width: '100%',
    marginBottom: spacing[3],
  },
  continueButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as any,
    textAlign: 'center',
  },
  startOverButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    width: '100%',
  },
  startOverButtonText: {
    color: colors.gray[500],
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium as any,
    textAlign: 'center',
  },
});
