import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FlashSaleStatus } from '../types/flash-sale.types';

/**
 * Format Flash Sale datetime to Vietnamese locale format
 * Output format: dd/MM/yyyy HH:mm (e.g., "15/01/2024 14:30")
 * 
 * Note: API returns UTC time, we display it as-is without timezone conversion
 * to match the exact time the Flash Sale runs on the server
 * 
 * @param dateTime - ISO datetime string from API (UTC)
 * @returns Formatted datetime string in Vietnamese locale
 * 
 * **Validates: Requirements 3.1**
 */
export function formatFlashSaleDateTime(dateTime: string): string {
  const utcString = dateTime.replace('Z', '');
  const [datePart, timePart] = utcString.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

/**
 * Get status badge color based on Flash Sale status
 * - NotStarted (0): gray
 * - Active (1): green
 * - Ended (2): red
 * 
 * @param status - FlashSaleStatus enum value
 * @returns Color string for badge styling
 * 
 * **Validates: Requirements 1.4, 3.2**
 */
export function getStatusColor(status: FlashSaleStatus): string {
  switch (status) {
    case FlashSaleStatus.NotStarted:
      return 'gray';
    case FlashSaleStatus.Active:
      return 'green';
    case FlashSaleStatus.Ended:
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Get status text in Vietnamese based on Flash Sale status
 * - NotStarted (0): "Chưa bắt đầu"
 * - Active (1): "Đang diễn ra"
 * - Ended (2): "Đã kết thúc"
 * 
 * @param status - FlashSaleStatus enum value
 * @returns Vietnamese status text
 * 
 * **Validates: Requirements 1.4, 3.2**
 */
export function getStatusText(status: FlashSaleStatus): string {
  switch (status) {
    case FlashSaleStatus.NotStarted:
      return 'Chưa bắt đầu';
    case FlashSaleStatus.Active:
      return 'Đang diễn ra';
    case FlashSaleStatus.Ended:
      return 'Đã kết thúc';
    default:
      return 'Chưa bắt đầu';
  }
}

/**
 * Check if a Flash Sale is currently active
 * 
 * @param status - FlashSaleStatus enum value
 * @returns true if status is Active (1), false otherwise
 * 
 * **Validates: Requirements 3.3**
 */
export function isFlashSaleActive(status: FlashSaleStatus): boolean {
  return status === FlashSaleStatus.Active;
}

/**
 * Check if shop can register for a Flash Sale
 * Shop can only register for Flash Sales that haven't ended yet
 * 
 * @param status - FlashSaleStatus enum value
 * @returns true if status is NotStarted (0) or Active (1), false if Ended (2)
 */
export function canRegisterFlashSale(status: FlashSaleStatus): boolean {
  return status === FlashSaleStatus.NotStarted || status === FlashSaleStatus.Active;
}