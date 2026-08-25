import { Component, signal } from '@angular/core';
import { Navbar } from './shared/components/navbar/navbar';
import { ProductsPage } from './features/products/products-page/products-page';

@Component({
  selector: 'app-root',
  imports: [Navbar, ProductsPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('axe-com-pimentas');
}
