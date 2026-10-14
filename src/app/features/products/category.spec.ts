import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { Category } from './category';

describe('Category', () => {
  let service: Category;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Category);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('provides the categories used by the catalog', () => {
    expect(service.categories.map((category) => category.id)).toEqual(['audio', 'wearables']);
    expect(service.categories.map((category) => category.label)).toEqual(['Áudio', 'Vestíveis']);
  });
});
