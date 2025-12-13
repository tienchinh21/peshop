export enum SenderType {
  User = 1,
  Shop = 2,
}
export interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  shopId: string;
  shopName: string;
  shopAvatar: string;
  lastMessage: string;
  seen: boolean;
  createdAt: string;
}
export interface Message {
  id: string;
  content: string;
  createdAt: string;
}
export interface ChatHistoryResponse {
  data: {
    it: Message[];
    me: Message[];
  }[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
}
export interface NormalizedMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: 'me' | 'other';
}
export interface SendMessageRequest {
  message: string;
  userId?: string;
  shopId?: string;
  type: SenderType;
}
export interface SendMessageResponse {
  status: boolean;
  message: string | null;
}
export interface ChatHistoryParams {
  userId: string;
  shopId: string;
  type: SenderType;
  page?: number;
  pageSize?: number;
}