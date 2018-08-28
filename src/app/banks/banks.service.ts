import { Bank } from './bank.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class BanksService {
  private banks: Bank[] = [];
  private banksUpdated = new Subject<Bank[]>();

  constructor(private http: HttpClient) {}

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

  addBank(name: String, value: String) {
    const bank: Bank = {id: null, name: name, value: value};
    this.http.post<{message: string, bankId: string}>('http://localhost:3000/api/banks', bank)
      .subscribe((responseData) => {
        const id = responseData.bankId;
        bank.id = id;
        this.banks.push(bank);
        this.banksUpdated.next([...this.banks]);

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

}
