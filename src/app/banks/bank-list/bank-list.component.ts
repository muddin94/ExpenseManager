import { Component } from '@angular/core';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent{
  banks = [
    {name: 'Capital One', content: 'What\'s in your wallet?'},
    {name: 'Wells Fargo', content: 'Together we\'ll go far!'},
    {name: 'Chase', content: 'The right relationship is everything.'}
  ];
}
