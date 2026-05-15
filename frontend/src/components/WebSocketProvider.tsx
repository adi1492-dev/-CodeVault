'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  broadcastRefresh: (event: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  broadcastRefresh: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export default function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the Go Fiber WebSocket server
    const ws = new WebSocket('ws://localhost:8080/ws');

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to CampusCore WebSocket Hub');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket Hub');
    };

    ws.onmessage = (event) => {
      // Create a generic window event that any component can listen to for UI updates
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'REFRESH_ALERTS') {
          // Dispatch a custom window event for components to pick up
          window.dispatchEvent(new CustomEvent('campuscore_alerts_refresh'));
        }
        if (data.type === 'PROCTOR_ALERT') {
          // Dispatch a proctor alert event for the teacher dashboard
          window.dispatchEvent(new CustomEvent('campuscore_proctor_alert', { detail: data }));
        }
      } catch {
        // Ignored
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Helper function to easily send sync triggers across all devices
  const broadcastRefresh = (event: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type: event }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, broadcastRefresh }}>
      {children}
    </WebSocketContext.Provider>
  );
}
