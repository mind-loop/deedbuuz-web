export interface OrderItem {
  id: number;
  productId: number;
  price: string;
  quantity: number;
  product: Product;
}
export interface Product {
  id: number;
  img: string;
  title: string;
  content: string;
  price: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  price: string;
  quantity: number;
  subtotal: string;
  product: Product;
}

export interface Basket {
  id: number;
  order_number: string;
  total_price: string;
  status: string;
  order_items: OrderItem[];
}