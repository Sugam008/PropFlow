'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { colors } from '@propflow/theme';

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

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: colors.gray[50],
        }}>
          <h1 style={{ color: colors.error, marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: colors.gray[600], marginBottom: '2rem' }}>
            We&apos;ve encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.primary[600],
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: colors.gray[100],
              borderRadius: '0.5rem',
              textAlign: 'left',
              maxWidth: '100%',
              overflow: 'auto',
              fontSize: '0.875rem',
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
