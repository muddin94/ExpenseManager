import { Component } from '@angular/core';

import { Bank } from './banks/bank.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedBanks: Bank[] = [];

  onBankAdded(bank){
    this.storedBanks.push(bank);
  }
}
