import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent{

  enteredName = '';
  enteredValue ='';

  @Output() bankCreated = new EventEmitter();


  onAddBank(){
    const bank = {
      name: this.enteredName,
      value: this.enteredValue
    };

    this.bankCreated.emit(bank);
  }
}
