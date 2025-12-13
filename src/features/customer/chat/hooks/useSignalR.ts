"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/shared/hooks";
import { signalRService, type ConnectionStatus, type SignalRMessage, type SignalRCallbacks } from "../services/signalr.service";
import { getSenderType } from "../utils/chat.utils";
export interface UseSignalROptions {
  onMessageReceived?: (message: SignalRMessage) => void;
  onConnectionStatusChanged?: (status: ConnectionStatus) => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
}
export interface UseSignalRReturn {
  status: ConnectionStatus;
  isConnected: boolean;
  isReconnecting: boolean;
  hasError: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connectionId: string | null;
}

/**
 * Hook for managing SignalR real-time connection
 * Automatically connects when user is authenticated and disconnects on unmount
 *
 * @param options - Configuration options for the hook
 * @returns Connection status and control functions
 */
export function useSignalR(options: UseSignalROptions = {}): UseSignalRReturn {
  const {
    onMessageReceived,
    onConnectionStatusChanged,
    onError,
    autoConnect = true
  } = options;
  const {
    isAuthenticated,
    roles
  } = useAuth();
  const senderType = getSenderType(roles);
  const [status, setStatus] = useState<ConnectionStatus>(signalRService.status);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const callbacksRef = useRef<UseSignalROptions>(options);
  callbacksRef.current = options;
  const handleStatusChange = useCallback((newStatus: ConnectionStatus) => {
    setStatus(newStatus);
    setConnectionId(signalRService.getConnectionId());
    callbacksRef.current.onConnectionStatusChanged?.(newStatus);
  }, []);
  const handleMessageReceived = useCallback((message: SignalRMessage) => {
    callbacksRef.current.onMessageReceived?.(message);
  }, []);
  const handleError = useCallback((error: Error) => {
    callbacksRef.current.onError?.(error);
  }, []);
  const connect = useCallback(async () => {
    const callbacks: SignalRCallbacks = {
      onMessageReceived: handleMessageReceived,
      onConnectionStatusChanged: handleStatusChange,
      onError: handleError
    };
    await signalRService.connect(callbacks, {
      senderType
    });
  }, [handleMessageReceived, handleStatusChange, handleError, senderType]);
  const disconnect = useCallback(async () => {
    await signalRService.disconnect();
  }, []);
  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      connect();
    }
    return () => {};
  }, [autoConnect, isAuthenticated, connect]);
  useEffect(() => {
    signalRService.updateCallbacks({
      onMessageReceived: handleMessageReceived,
      onConnectionStatusChanged: handleStatusChange,
      onError: handleError
    });
  }, [handleMessageReceived, handleStatusChange, handleError]);
  useEffect(() => {
    return () => {};
  }, []);
  return {
    status,
    isConnected: status === "connected",
    isReconnecting: status === "reconnecting",
    hasError: status === "error",
    connect,
    disconnect,
    connectionId
  };
}
export type { ConnectionStatus, SignalRMessage } from "../services/signalr.service";