import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useUIStore } from '../store/useUIStore';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInternetReachable: true,
  connectionType: null,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>({
    isConnected: true,
    isInternetReachable: true,
    connectionType: null,
  });

  const addToast = useUIStore((state) => state.addToast);

  useEffect(() => {
    // Check initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });
    });

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      };

      // Show toast when connection is lost
      if (networkState.isConnected && !newState.isConnected) {
        addToast({
          message: 'Connection lost. Working offline...',
          type: 'warning',
          duration: 5000,
        });
      }

      // Show toast when connection is restored
      if (!networkState.isConnected && newState.isConnected) {
        addToast({
          message: 'Connection restored!',
          type: 'success',
          duration: 3000,
        });
      }

      setNetworkState(newState);
    });

    return () => unsubscribe();
  }, [networkState.isConnected, addToast]);

  return <NetworkContext.Provider value={networkState}>{children}</NetworkContext.Provider>;
};
