import { axiosDotnet } from '@/shared/services/http';
import { SenderType, type Conversation, type ChatHistoryResponse, type ChatHistoryParams, type SendMessageRequest, type SendMessageResponse } from '../types/chat.types';
const ENDPOINTS = {
  CONVERSATIONS: '/Message/conversations',
  CHAT_HISTORY: '/Message/chat',
  SEND_MESSAGE: '/Message/send-message'
} as const;
export const chatService = {
  getConversations: async (type: SenderType): Promise<Conversation[]> => {
    console.log("[chatService] Getting conversations, type:", type);
    const response = await axiosDotnet.get<{
      error: string | null;
      data: Conversation[];
    }>(ENDPOINTS.CONVERSATIONS, {
      params: {
        type
      }
    });
    console.log("[chatService] Conversations response:", response.data);
    return response.data.data;
  },
  getChatHistory: async (params: ChatHistoryParams): Promise<ChatHistoryResponse> => {
    const {
      userId,
      shopId,
      type,
      page = 1,
      pageSize = 20
    } = params;
    console.log("[chatService] Getting chat history:", {
      userId,
      shopId,
      type,
      page,
      pageSize
    });
    try {
      const response = await axiosDotnet.get<{
        error: string | null;
        data: ChatHistoryResponse;
      }>(ENDPOINTS.CHAT_HISTORY, {
        params: {
          userId,
          shopId,
          type,
          page,
          pageSize
        }
      });
      return response.data.data;
    } catch (error) {
      console.error("[chatService] Error getting chat history:", error);
      throw error;
    }
  },
  sendMessage: async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    console.log("[chatService] Sending message to:", ENDPOINTS.SEND_MESSAGE, request);
    try {
      const response = await axiosDotnet.post<SendMessageResponse>(ENDPOINTS.SEND_MESSAGE, request);
      console.log("[chatService] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[chatService] Error sending message:", error);
      throw error;
    }
  }
};