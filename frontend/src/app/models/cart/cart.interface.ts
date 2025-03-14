import { CartItem } from './cartItem.iterface';

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}
