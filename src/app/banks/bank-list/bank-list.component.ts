import { AuthService } from './../../auth/auth.service';
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

  banks: Bank[] = [];
  isLoading = false;
  totalBanks = 0;
  banksPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private banksSubscription: Subscription;
  private authStatusSub: Subscription;


  constructor(public banksService: BanksService, private authService: AuthService) {

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
    this.userId = this.authService.getUserId();
    this.banksSubscription = this.banksService.getBankUpdateListener()
      .subscribe((bankData: { banks: Bank[], bankCount: number}) => {
        this.isLoading = false;
        this.banks = bankData.banks;
        this.totalBanks = bankData.bankCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.banksSubscription.unsubscribe();

    this.authStatusSub.unsubscribe();
  }

}
