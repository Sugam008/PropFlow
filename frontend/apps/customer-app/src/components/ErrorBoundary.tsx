import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, typography } from '@propflow/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content} accessibilityRole="alert">
            <Text style={styles.title} accessibilityRole="header">Something went wrong</Text>
            <Text style={styles.message}>
              An unexpected error occurred. Please try again or restart the app.
            </Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={this.handleReset}
              accessibilityRole="button"
              accessibilityLabel="Try Again"
              accessibilityHint="Attempts to reload the current screen"
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            {__DEV__ && (
              <View 
                style={styles.debugContainer} 
                accessible={true} 
                accessibilityLabel="Debug Information"
              >
                <Text style={styles.debugText}>{this.state.error?.toString()}</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 12,
    fontFamily: typography.fonts.sans,
  },
  message: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: typography.fonts.sans,
  },
  button: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fonts.sans,
  },
  debugContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    width: '100%',
  },
  debugText: {
    fontSize: 12,
    color: colors.gray[800],
    fontFamily: 'monospace',
  },
});
