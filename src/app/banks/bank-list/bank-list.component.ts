import { Component } from '@angular/core';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent{
  banks = [
    {name: 'Capital One', description: 'This is Capital One\'s description'},
    {name: 'Wells Fargo', description: 'This is Wells Fargo\'s description'},
    {name: 'Chase', description: 'This is Chase\'s description'}
  ]
}
