import { FlashSaleStatus, FlashSaleToday, TimeRemaining } from '../types/flash-sale.types';

/**
 * Find the active Flash Sale from a list of Flash Sales
 * Returns the first Flash Sale with status === Active (1), or null if none exists
 * 
 * @param flashSales - Array of Flash Sales or single Flash Sale to search
 * @returns The active Flash Sale or null
 * 
 * Requirements: 1.2
 */
export const findActiveFlashSale = (flashSales: FlashSaleToday[] | FlashSaleToday | null | undefined): FlashSaleToday | null => {
  if (!flashSales) {
    return null;
  }
  if (Array.isArray(flashSales)) {
    if (flashSales.length === 0) {
      return null;
    }
    return flashSales.find(sale => sale.status === FlashSaleStatus.Active) ?? null;
  }
  if (typeof flashSales === 'object' && 'flashSaleId' in flashSales && 'status' in flashSales) {
    return flashSales.status === FlashSaleStatus.Active ? flashSales : null;
  }
  return null;
};

/**
 * Calculate the time remaining until the end of a Flash Sale
 * 
 * @param endTime - ISO string representing the end time
 * @returns TimeRemaining object with hours, minutes, seconds, and isExpired flag
 * 
 * Requirements: 2.1
 */
export const calculateTimeRemaining = (endTime: string): TimeRemaining => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;
  if (diff <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
  const seconds = Math.floor(diff % (1000 * 60) / 1000);
  return {
    hours,
    minutes,
    seconds,
    isExpired: false
  };
};

/**
 * Format a time value with leading zero padding
 * 
 * @param value - Number to format (0-99)
 * @returns String with exactly 2 characters, padded with leading zero if needed
 * 
 * Requirements: 2.4
 */
export const formatTimeValue = (value: number): string => {
  return value.toString().padStart(2, '0');
};

/**
 * Calculate the sold percentage for progress bar display
 * 
 * @param usedQuantity - Number of items sold
 * @param quantity - Total quantity available
 * @returns Percentage value between 0 and 100
 * 
 * Requirements: 3.3
 */
export const calculateSoldPercentage = (usedQuantity: number, quantity: number): number => {
  if (quantity <= 0) {
    return 0;
  }
  const percentage = usedQuantity / quantity * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

/**
 * Check if a product is sold out
 * 
 * @param usedQuantity - Number of items sold
 * @param quantity - Total quantity available
 * @returns true if usedQuantity >= quantity
 * 
 * Requirements: 3.4
 */
export const isProductSoldOut = (usedQuantity: number, quantity: number): boolean => {
  return usedQuantity >= quantity;
};