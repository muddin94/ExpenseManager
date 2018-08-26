import { Component, EventEmitter, Output } from "@angular/core";

import { Bank } from '../bank.model';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent{

  enteredName = '';
  enteredValue ='';

  @Output() bankCreated = new EventEmitter<Bank>();


  onAddBank(form: NgForm){

    if(form.invalid){
      return;
    }

    const bank: Bank = {
      name: form.value.name,
      value: form.value.value
    };

    this.bankCreated.emit(bank);
  }
}
