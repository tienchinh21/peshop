/**
 * GHN Tracking Types
 * Types for order tracking from GHN API
 */

export interface TrackingLocation {
  address: string;
  ward_code: string;
  district_id: number;
  warehouse_id: number;
}

export interface TrackingLog {
  order_code: string;
  status: string;
  status_name: string;
  location: TrackingLocation;
  action_at: string;
}

export interface LeadtimeOrder {
  from_estimate_date: string;
  to_estimate_date: string;
  picked_date: string | null;
  delivered_date: string | null;
}

export interface TrackingItem {
  name: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  category: Record<string, unknown>;
  weight: number;
  status: string;
  item_order_code: string;
  current_warehouse_id: number;
}

export interface OrderInfo {
  order_code: string;
  status: string;
  status_name: string;
  picktime: string;
  leadtime: string;
  leadtime_order: LeadtimeOrder;
  finish_date: string | null;
  content: string;
  weight: number;
  converted_weight: number;
  required_note: string;
  to_name: string;
  to_phone: string;
  to_address: string;
  total_fee: number;
  items: TrackingItem[];
}

export interface TrackingData {
  order_info: OrderInfo;
  tracking_logs: TrackingLog[];
}

export interface TrackingResponse {
  error: string | null;
  data: TrackingData;
}
