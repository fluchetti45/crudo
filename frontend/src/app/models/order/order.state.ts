import { Order } from './order.interface';

export interface OrderState {
  orders: Order[];
  orderDetail: Order;
  loading: boolean;
  error: string | null;
  success: string | null;
  totalAmount: number;
  totalItems: number;
  isCheckoutComplete: boolean;
}
