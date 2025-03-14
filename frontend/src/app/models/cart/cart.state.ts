import { CartItem } from '../cart/cartItem.iterface';

export interface CartState {
  products: CartItem[];
  loading: boolean;
  error: string | null;
  success: string | null;
  totalAmount: number;
  totalItems: number;
  isCheckoutComplete: boolean;
}
