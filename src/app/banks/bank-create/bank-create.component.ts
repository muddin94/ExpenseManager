import { OnDestroy } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { mimeType } from './mime-type.validator';
import { BanksService } from './../banks.service';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Bank } from '../bank.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create-component.css']
})
export class BankCreateComponent implements OnInit, OnDestroy {

  enteredName = '';
  enteredValue = '';
  private mode = 'create';
  private bankId: string;
  bank: Bank;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;


  constructor(
    public banksService: BanksService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {}


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
      this.banksService.addBank(
        this.form.value.name,
        this.form.value.value,
        this.form.value.image
      );
    } else {
      this.banksService.updateBank(
        this.bankId,
        this.form.value.name,
        this.form.value.value,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  ngOnInit() {
    this.authService.getAuthStatusListener().subscribe( authStatus => {
      this.isLoading = false;
    })
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
          this.bank = {
            id: bankData._id,
            name: bankData.name,
            value: bankData.value,
            imagePath: bankData.imagePath,
            creator: bankData.creator
          };
          this.form.setValue({
            'name': this.bank.name,
            'value': this.bank.value,
            'image': this.bank.imagePath
          });
        });

      } else {
        this.mode = 'create';
        this.bankId = null;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
