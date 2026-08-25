import { Product } from '../../features/products/product';

export interface CartItem {
  product: Product;
  quantity: number;
}
