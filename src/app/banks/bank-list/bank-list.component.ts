import { Component } from '@angular/core';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent{
  banks = [
<<<<<<< HEAD
    {name: 'Capital One', description: 'This is Capital One\'s description'},
    {name: 'Wells Fargo', description: 'This is Wells Fargo\'s description'},
    {name: 'Chase', description: 'This is Chase\'s description'}
  ]
=======
    {name: 'Capital One', content: 'What\'s in your wallet?'},
    {name: 'Wells Fargo', content: 'Together we\'ll go far!'},
    {name: 'Chase', content: 'The right relationship is everything.'}
  ];
>>>>>>> f64a9d6eba7b3372f037f4d4526843f431aa1ef3
}
