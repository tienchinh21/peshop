import * as signalR from "@microsoft/signalr";
import { getAuthToken } from "@/shared/services/auth";
import { SenderType } from "../types/chat.types";
const SIGNALR_HUB_URL = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || `${process.env.NEXT_PUBLIC_API_URL_DOTNET}/hubs/notification`;
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting" | "error";
// Raw message from SignalR server (PascalCase)
export interface SignalRRawMessage {
  UserId: string;
  ShopId: string;
  Message: string;
  CreatedAt: string;
}

// Normalized message for application use (camelCase)
export interface SignalRMessage {
  userId: string;
  shopId: string;
  content: string;
  createdAt: string;
}

// Helper to normalize SignalR message from PascalCase to camelCase
function normalizeSignalRMessage(raw: SignalRRawMessage): SignalRMessage {
  return {
    userId: raw.UserId,
    shopId: raw.ShopId,
    content: raw.Message,
    createdAt: raw.CreatedAt,
  };
}
export interface SignalRCallbacks {
  onMessageReceived?: (message: SignalRMessage) => void;
  onConnectionStatusChanged?: (status: ConnectionStatus) => void;
  onError?: (error: Error) => void;
}
export interface SignalRConnectOptions {
  senderType: SenderType;
}
const RECONNECT_DELAYS = [0, 2000, 5000, 10000, 30000];
const MAX_RECONNECT_ATTEMPTS = 5;
class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private callbacks: SignalRCallbacks = {};
  private reconnectAttempts = 0;
  private _status: ConnectionStatus = "disconnected";
  private _senderType: SenderType = SenderType.User;
  get status(): ConnectionStatus {
    return this._status;
  }
  private setStatus(status: ConnectionStatus): void {
    this._status = status;
    this.callbacks.onConnectionStatusChanged?.(status);
  }

  /**
   * Initialize and start SignalR connection
   * @param callbacks - Event callbacks for message and status changes
   * @param options - Connection options including senderType
   */
  async connect(callbacks?: SignalRCallbacks, options?: SignalRConnectOptions): Promise<void> {
    if (callbacks) {
      this.callbacks = callbacks;
    }
    if (options?.senderType) {
      this._senderType = options.senderType;
    }
    if (this.connection?.state === signalR.HubConnectionState.Connected || this.connection?.state === signalR.HubConnectionState.Connecting) {
      return;
    }
    if (!SIGNALR_HUB_URL || SIGNALR_HUB_URL === "undefined/hubs/notification") {
      console.warn("[SignalR] Hub URL not configured, skipping connection");
      this.setStatus("disconnected");
      return;
    }
    try {
      this.setStatus("connecting");
      const token = getAuthToken();
      // Server expects string type: "user" or "shop" instead of numeric 1 or 2
      const typeString = this._senderType === SenderType.User ? "user" : "shop";
      const hubUrlWithType = `${SIGNALR_HUB_URL}?type=${typeString}`;
      console.log("[SignalR] Connecting to:", hubUrlWithType);
      this.connection = new signalR.HubConnectionBuilder().withUrl(hubUrlWithType, {
        accessTokenFactory: () => token || ""
      }).withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount >= MAX_RECONNECT_ATTEMPTS) {
            return null;
          }
          return RECONNECT_DELAYS[retryContext.previousRetryCount] || RECONNECT_DELAYS[RECONNECT_DELAYS.length - 1];
        }
      }).configureLogging(signalR.LogLevel.Information).build();
      this.setupEventHandlers();
      await this.connection.start();
      this.reconnectAttempts = 0;
      this.setStatus("connected");
      console.log("[SignalR] Connected successfully!");
    } catch (error) {
      console.warn("[SignalR] Connection failed (non-blocking):", error instanceof Error ? error.message : error);
      this.setStatus("disconnected");
    }
  }
  private setupEventHandlers(): void {
    if (!this.connection) return;
    this.connection.on("Message", (rawMessageOrString: SignalRRawMessage | string) => {
      console.log("[SignalR] Raw message received:", rawMessageOrString);
      
      // Server may send message as JSON string, need to parse it
      let rawMessage: SignalRRawMessage;
      if (typeof rawMessageOrString === "string") {
        try {
          rawMessage = JSON.parse(rawMessageOrString);
          console.log("[SignalR] Parsed JSON string message:", rawMessage);
        } catch (e) {
          console.error("[SignalR] Failed to parse message string:", e);
          return;
        }
      } else {
        rawMessage = rawMessageOrString;
      }
      
      const normalizedMessage = normalizeSignalRMessage(rawMessage);
      console.log("[SignalR] Normalized message:", normalizedMessage);
      this.callbacks.onMessageReceived?.(normalizedMessage);
    });
    this.connection.onclose(error => {
      console.warn("[SignalR] Connection closed:", error?.message);
      this.setStatus("disconnected");
      if (error) {
        this.callbacks.onError?.(error);
        this.scheduleReconnect();
      }
    });
    this.connection.onreconnecting(error => {
      console.warn("[SignalR] Reconnecting:", error?.message);
      this.setStatus("reconnecting");
    });
    this.connection.onreconnected(connectionId => {
      console.log("[SignalR] Reconnected with ID:", connectionId);
      this.reconnectAttempts = 0;
      this.setStatus("connected");
    });
  }
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error("[SignalR] Max reconnection attempts reached");
      this.setStatus("error");
      return;
    }
    const delay = RECONNECT_DELAYS[this.reconnectAttempts] || RECONNECT_DELAYS[RECONNECT_DELAYS.length - 1];
    this.reconnectAttempts++;
    console.log(`[SignalR] Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    setTimeout(() => {
      if (this._status !== "connected") {
        this.connect();
      }
    }, delay);
  }
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error("[SignalR] Disconnect error:", error);
      } finally {
        this.connection = null;
        this.reconnectAttempts = 0;
        this.setStatus("disconnected");
      }
    }
  }
  updateCallbacks(callbacks: Partial<SignalRCallbacks>): void {
    this.callbacks = {
      ...this.callbacks,
      ...callbacks
    };
  }
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
  getConnectionId(): string | null {
    return this.connection?.connectionId ?? null;
  }
}
export const signalRService = new SignalRService();