import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Bank } from '../bank.model';
import { BanksService } from '../banks.service';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit, OnDestroy {

  // banks = [
  //   {name: 'Capital One', content: 'What\'s in your wallet?'},
  //   {name: 'Wells Fargo', content: 'Together we\'ll go far!'},
  //   {name: 'Chase', content: 'The right relationship is everything.'}
  // ];

  banks: Bank[] = [];
  isLoading = false;
  private banksSubscription: Subscription;

  constructor(public banksService: BanksService) {

  }


  onDelete(bankId: string) {
    this.banksService.deleteBank(bankId);
  }

  ngOnInit() {
    this.banksService.getBanks();
    this.isLoading = true;
    this.banksSubscription = this.banksService.getBankUpdateListener()
      .subscribe((banks) => {
        this.isLoading = false;
        this.banks = banks;
      });
  }

  ngOnDestroy() {
    this.banksSubscription.unsubscribe();
  }

}
