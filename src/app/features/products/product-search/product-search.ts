import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-search',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIcon],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
})
export class ProductSearch {
  readonly value = input('');
  readonly placeholder = input('Pesquisar produtos...');

  readonly valueChange = output<string>();

  protected onInput(value: string) {
    this.valueChange.emit(value);
  }

  protected clear() {
    this.valueChange.emit('');
  }
}
