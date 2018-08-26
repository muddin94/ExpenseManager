import { Component, EventEmitter, Output } from "@angular/core";

import { Bank } from '../bank.model';

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent{

  enteredName = '';
  enteredValue ='';

  @Output() bankCreated = new EventEmitter<Bank>();


  onAddBank(){
    const bank: Bank = {
      name: this.enteredName,
      value: this.enteredValue
    };

    this.bankCreated.emit(bank);
  }
}
