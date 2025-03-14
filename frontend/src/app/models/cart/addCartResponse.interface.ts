import { CartItem } from './cartItem.iterface';

export interface AddCartResponse {
  success: boolean;
  message: string;
  cartItem?: CartItem;
}
