import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  protected title = 'Contador';

  protected count = signal(0);

  protected doubleCont = computed(() => this.count() * 2);

  protected increateCounter(){
    this.count.update(value => value + 1)
  };

  protected decreaseConter(){
    this.count.update(value => value - 1)
  };

  protected resetCounter(){
    this.count.set(0);
  }
}
