import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { CartPage } from './features/cart/cart-page/cart-page';
import { ProductsPage } from './features/products/products-page/products-page';

export const routes: Routes = [
  { path: '', component: ProductsPage },
  { path: 'cart', component: CartPage },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/admin-login/admin-login').then((module) => module.AdminLogin),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then((module) => module.Checkout),
  },
  {
    path: 'products/new',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/products/product-create/product-create').then(
        (module) => module.ProductCreate,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-details/product-details').then(
        (module) => module.ProductDetails,
      ),
  },
];
