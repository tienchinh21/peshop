import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SenderType, type Message, type NormalizedMessage } from '../types/chat.types';


export function normalizeMessages(itMessages: Message[], meMessages: Message[]): NormalizedMessage[] {
  const normalized: NormalizedMessage[] = [...itMessages.map(m => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt,
    sender: 'other' as const
  })), ...meMessages.map(m => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt,
    sender: 'me' as const
  }))];
  return normalized.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}


export function getSenderType(roles: string[]): SenderType {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/shop/') || pathname === '/shop') {
      return SenderType.Shop;
    }
  }
  return SenderType.User;
}


export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'HH:mm', {
      locale: vi
    });
  }
  if (isYesterday(date)) {
    return `Hôm qua ${format(date, 'HH:mm', {
      locale: vi
    })}`;
  }
  const currentYear = new Date().getFullYear();
  if (date.getFullYear() === currentYear) {
    return format(date, 'dd/MM HH:mm', {
      locale: vi
    });
  }
  return format(date, 'dd/MM/yyyy HH:mm', {
    locale: vi
  });
}