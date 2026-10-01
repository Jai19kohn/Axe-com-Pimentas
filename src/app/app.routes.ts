import { Routes } from '@angular/router';
import { CartPage } from './features/cart/cart-page/cart-page';
import { ProductsPage } from './features/products/products-page/products-page';

export const routes: Routes = [
  { path: '', component: ProductsPage },
  { path: 'cart', component: CartPage },
];
