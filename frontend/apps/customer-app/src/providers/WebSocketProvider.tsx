import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.close();
      }
      return;
    }

    const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    const API_BASE_OVERRIDE = process.env.EXPO_PUBLIC_API_BASE_URL;
    const WS_BASE = (API_BASE_OVERRIDE || `http://${LOCAL_HOST}:8000/api/v1`).replace('http', 'ws');
    const wsUrl = `${WS_BASE}/websocket/ws/${token}`;

    const connect = () => {
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          setLastMessage(message);

          // Handle specific events
          if (message.type === 'property:updated') {
            // Invalidate property-related queries
            queryClient.invalidateQueries({ queryKey: ['properties'] });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt reconnection after a delay
        setTimeout(() => {
          if (isAuthenticated && token) {
            connect();
          }
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token, isAuthenticated, queryClient]);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
