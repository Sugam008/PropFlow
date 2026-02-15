import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@propflow/theme';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';

// Main Screens
import { PropertyTypeScreen } from '../screens/main/PropertyTypeScreen';
import { PropertyDetailsScreen } from '../screens/main/PropertyDetailsScreen';
import { LocationScreen } from '../screens/main/LocationScreen';
import { PhotoCaptureScreen } from '../screens/main/PhotoCaptureScreen';
import { PhotoReviewScreen } from '../screens/main/PhotoReviewScreen';
import { SubmitScreen } from '../screens/main/SubmitScreen';
import { StatusScreen } from '../screens/main/StatusScreen';
import { ValuationResultScreen } from '../screens/main/ValuationResultScreen';
import { FollowUpScreen } from '../screens/main/FollowUpScreen';

import { useAuthStore } from '../store/useAuthStore';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  // Auth
  Welcome: undefined;
  OTP: { phone?: string };
  // Main
  PropertyType: undefined;
  PropertyDetails: undefined;
  Location: undefined;
  PhotoCapture: undefined;
  PhotoReview: undefined;
  Submit: undefined;
  Status: undefined;
  ValuationResult: { propertyId: string };
  FollowUp: { propertyId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <Stack.Group screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Group>
);

const MainNavigator = () => (
  <Stack.Group
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary[500] },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="PropertyType"
      component={PropertyTypeScreen}
      options={{ title: 'Property Type' }}
    />
    <Stack.Screen
      name="PropertyDetails"
      component={PropertyDetailsScreen}
      options={{ title: 'Details' }}
    />
    <Stack.Screen name="Location" component={LocationScreen} options={{ title: 'Location' }} />
    <Stack.Screen
      name="PhotoCapture"
      component={PhotoCaptureScreen}
      options={{ title: 'Photos' }}
    />
    <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} options={{ title: 'Review' }} />
    <Stack.Screen name="Submit" component={SubmitScreen} options={{ title: 'Submit' }} />
    <Stack.Screen name="Status" component={StatusScreen} options={{ title: 'Status' }} />
    <Stack.Screen
      name="ValuationResult"
      component={ValuationResultScreen}
      options={{ title: 'Valuation' }}
    />
    <Stack.Screen name="FollowUp" component={FollowUpScreen} options={{ title: 'Follow Up' }} />
  </Stack.Group>
);

export const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>{isAuthenticated ? MainNavigator() : AuthNavigator()}</Stack.Navigator>
    </NavigationContainer>
  );
};
