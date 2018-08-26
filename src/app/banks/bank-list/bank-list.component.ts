import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Bank } from '../bank.model';
import { BanksService } from '../banks.service';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit, OnDestroy{

  // banks = [
  //   {name: 'Capital One', content: 'What\'s in your wallet?'},
  //   {name: 'Wells Fargo', content: 'Together we\'ll go far!'},
  //   {name: 'Chase', content: 'The right relationship is everything.'}
  // ];

  banks: Bank[] = [];
  private banksSubscription: Subscription;

  constructor(public banksService: BanksService){

  }

  ngOnInit(){
    this.banks = this.banksService.getBanks();
    this.banksSubscription = this.banksService.getPostUpdateListener()
      .subscribe((banks) => {
        this.banks = banks;
      });
  }

  ngOnDestroy(){
    this.banksSubscription.unsubscribe();
  }

}
