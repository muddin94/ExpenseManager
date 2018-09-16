import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Bank } from '../bank.model';
import { BanksService } from '../banks.service';
import { PageEvent } from '@angular/material';

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
  totalBanks = 0;
  banksPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private banksSubscription: Subscription;

  constructor(public banksService: BanksService) {

  }


  onDelete(bankId: string) {
    this.isLoading = true;
    this.banksService.deleteBank(bankId).subscribe(() => {
      this.banksService.getBanks(this.banksPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.banksPerPage = pageData.pageSize;
    this.banksService.getBanks(this.banksPerPage, this.currentPage);
  }

  ngOnInit() {
    this.banksService.getBanks(this.banksPerPage, this.currentPage);
    this.isLoading = true;
    this.banksSubscription = this.banksService.getBankUpdateListener()
      .subscribe((bankData: { banks: Bank[], bankCount: number}) => {
        this.isLoading = false;
        this.banks = bankData.banks;
        this.totalBanks = bankData.bankCount;
      });
  }

  ngOnDestroy() {
    this.banksSubscription.unsubscribe();
  }

}
