import { Component } from "@angular/core";

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent{
  enteredValue ='';
  newBank ='NO CONTENT';

  onAddBank(){

    this.newBank = this.enteredValue;
  }
}
