import { mimeType } from './mime-type.validator';
import { BanksService } from './../banks.service';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
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
  form: FormGroup;
  imagePreview: string


  constructor(public banksService: BanksService, public route: ActivatedRoute) {

  }


  onFileSelected(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

  onSaveBank() {

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.banksService.addBank(this.form.value.name, this.form.value.value);
    } else {
      this.banksService.updateBank(this.bankId, this.form.value.name, this.form.value.value);
    }

    this.form.reset();
  }

  ngOnInit() {

    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'value': new FormControl(null, {
        validators:[Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bankId')) {
        this.mode = 'edit';
        this.bankId = paramMap.get('bankId');
        this.isLoading = true;
        this.banksService.getBank(this.bankId).subscribe(bankData => {
          this.isLoading = false;
          this.bank = { id: bankData._id, name: bankData.name, value: bankData.value};
          this.form.setValue({
            'name': this.bank.name,
            'value': this.bank.value
          });
        });

      } else {
        this.mode = 'create';
        this.bankId = null;
      }
    });
  }
}
