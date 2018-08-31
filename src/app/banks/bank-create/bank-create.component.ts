import { BanksService } from './../banks.service';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Bank } from '../bank.model';

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent implements OnInit {

  enteredName = '';
  enteredValue = '';
  private mode = 'create';
  private bankId: string;
  bank: Bank;
  isLoading = false;

  constructor(public banksService: BanksService, public route: ActivatedRoute) {

  }

  onSaveBank(form: NgForm) {

    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.banksService.addBank(form.value.name, form.value.value);
    } else {
      this.banksService.updateBank(this.bankId, form.value.name, form.value.value);
    }

    form.resetForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bankId')) {
        this.mode = 'edit';
        this.bankId = paramMap.get('bankId');
        this.isLoading = true;
        this.banksService.getBank(this.bankId).subscribe(bankData => {
          this.isLoading = false;
          this.bank = { id: bankData._id, name: bankData.name, value: bankData.value};
        });
      } else {
        this.mode = 'create';
        this.bankId = null;
      }
    });
  }
}
