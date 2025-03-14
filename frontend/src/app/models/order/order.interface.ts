export interface ShippingData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface OrderItem {
  itemId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  items: OrderItem[];
  shippingData: ShippingData;
}

export interface OrderAdmin {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  userId: string;
}

export interface OrderDetail {
  data: {
    id: number;
    errorMessage: string;
    status: string;
    total: number;
    createdAt: Date;
    items: OrderItem[];
    shippingData: ShippingData;
  };
  isSuccess: boolean;
  error: string | null;
}
