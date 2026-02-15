'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

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

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. If not authenticated, do nothing (or cleanup existing)
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    // 2. Define connect logic
    const connect = () => {
      // Prevent duplicate connections if one is already open/opening
      if (
        socketRef.current?.readyState === WebSocket.OPEN ||
        socketRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      // Cleanup any pending reconnect timers
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
      // Basic heuristic: replace http->ws, https->wss
      const WS_BASE = API_BASE.replace(/^http/, 'ws');
      const wsUrl = `${WS_BASE}/websocket/ws/${token}`;

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

          if (message.type === 'property:new' || message.type === 'property:updated') {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        socketRef.current = null;

        // Attempt reconnection after a delay, only if still authenticated
        // Use a ref to prevent stacking timeouts (though we clear above too)
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isAuthenticated && token) {
            connect();
          }
        }, 5000); // Increased delay to 5s to be safer
      };

      ws.onerror = (error) => {
        // Just log it; onclose will generally fire afterwards
        console.warn('WebSocket error:', error);
      };
    };

    // 3. Initial connection trigger
    connect();

    // 4. Cleanup on unmount or dependency change
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        // Remove listeners to prevent zombie callbacks
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token, isAuthenticated, queryClient]);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
