import { BanksService } from './../banks.service';
import { Component, EventEmitter, Output } from "@angular/core";

import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent{

  enteredName = '';
  enteredValue ='';

  constructor(public banksService: BanksService){

  }

  onAddBank(form: NgForm){

    if(form.invalid){
      return;
    }

    this.banksService.addBank(form.value.name, form.value.value);

  }
}
