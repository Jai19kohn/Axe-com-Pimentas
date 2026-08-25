import { Injectable, signal } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Eletrônicos' },
  { id: 2, name: 'Acessórios' },
];

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesSignal = signal<Category[]>(MOCK_CATEGORIES);

  readonly categories = this.categoriesSignal.asReadonly();
}
