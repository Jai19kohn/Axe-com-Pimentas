import { Component, signal } from '@angular/core';
import { Navbar } from './shared/components/navbar/navbar';
import { ProductGrid } from './features/products/product-grid/product-grid';

@Component({
  selector: 'app-root',
  imports: [Navbar, ProductGrid],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('axe-com-pimentas');
}
