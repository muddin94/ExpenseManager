import { Router } from '@angular/router';
import { Bank } from './bank.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class BanksService {
  private banks: Bank[] = [];
  private banksUpdated = new Subject<Bank[]>();

  constructor(private http: HttpClient, private router:Router) {}

  getBanks() {
    this.http.get<{message: string, banks: any }>('http://localhost:3000/api/banks')
      .pipe(map((bankData) => {
        return bankData.banks.map(bank => {
          return {
            name: bank.name,
            value: bank.value,
            id: bank._id
          };
        });
      }))
      .subscribe((transformedBanks) => {
        this.banks = transformedBanks;
        this.banksUpdated.next([...this.banks]);
      });
  }

  getBankUpdateListener() {
    return this.banksUpdated.asObservable();
  }

  getBank(id: string) {
    return this.http.get<{_id:string, name: string, value: string}>('http://localhost:3000/api/banks/' + id);
  }

  addBank(name: String, value: String) {
    const bank: Bank = {id: null, name: name, value: value};
    this.http.post<{message: string, bankId: string}>('http://localhost:3000/api/banks', bank)
      .subscribe((responseData) => {
        const id = responseData.bankId;
        bank.id = id;
        this.banks.push(bank);
        this.banksUpdated.next([...this.banks]);
        this.router.navigate(["/"]);
      });

  }

  deleteBank(bankId: String) {
    this.http.delete('http://localhost:3000/api/banks/' + bankId)
    .subscribe(() => {
      const updatedBanks = this.banks.filter(bank => bank.id !== bankId);
      this.banks = updatedBanks;
      this.banksUpdated.next([...this.banks]);
    });
  }

  updateBank(id: string, name: string, value: string) {

    const bank: Bank = { id: id, name: name, value: value};
    this.http.put('http://localhost:3000/api/banks/' + id, bank)
      .subscribe(response => {
        const updatedBanks = [...this.banks];
        const oldBankIndex = updatedBanks.findIndex(b => b.id === bank.id);
        updatedBanks[oldBankIndex] = bank;
        this.banks = updatedBanks;
        this.banksUpdated.next([...this.banks]);
        this.router.navigate(["/"]);
      });
  }

}
