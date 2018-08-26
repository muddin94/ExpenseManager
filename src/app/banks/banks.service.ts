import { Bank } from './bank.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class BanksService{
  private banks:Bank[] = [];
  private banksUpdated = new Subject<Bank[]>();

  getBanks(){
    return [...this.banks];
  }

  getPostUpdateListener(){
    return this.banksUpdated.asObservable();
  }

  addBank(name: String, value: String){
    const bank: Bank = {name: name, value: value};
    this.banks.push(bank);
    this.banksUpdated.next([...this.banks]);
  }

}
