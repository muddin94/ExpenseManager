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
            id: bank._id,
            imagePath: bank.imagePath
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
    return this.http.get<{_id:string, name: string, value: string, imagePath: string}>(
      'http://localhost:3000/api/banks/' + id
    );
  }

  addBank(name: string, value: string, image: File) {
    const bankData = new FormData();

    bankData.append('name', name);
    bankData.append('value', value);
    bankData.append('image', image, name);

    this.http
    .post<{message: string; bank: Bank}>(
      'http://localhost:3000/api/banks',
      bankData
    )
      .subscribe(responseData => {
        const bank: Bank = {
          id: responseData.bank.id,
          name: name,
          value: value,
          imagePath: responseData.bank.imagePath
        };
        this.banks.push(bank);
        this.banksUpdated.next([...this.banks]);
        this.router.navigate(['/']);
      });

  }

  deleteBank(bankId: string) {
    this.http.delete('http://localhost:3000/api/banks/' + bankId)
    .subscribe(() => {
      const updatedBanks = this.banks.filter(bank => bank.id !== bankId);
      this.banks = updatedBanks;
      this.banksUpdated.next([...this.banks]);
    });
  }

  updateBank(id: string, name: string, value: string, image: File | string) {
    let bankData: Bank | FormData;
    if(typeof(image) === 'object'){
      bankData = new FormData();
      bankData.append('id', id);
      bankData.append('name', name);
      bankData.append('value', value);
      bankData.append('image', image, name);
    } else {
      bankData = {
        id: id,
        name: name,
        value:value,
        imagePath: image
      };
    }

    this.http.put('http://localhost:3000/api/banks/' + id, bankData)
      .subscribe(response => {
        const updatedBanks = [...this.banks];
        const oldBankIndex = updatedBanks.findIndex(b => b.id === id);
        const bank: Bank = {
          id: id,
          name: name,
          value:value,
          imagePath: ''
        };
        updatedBanks[oldBankIndex] = bank;
        this.banks = updatedBanks;
        this.banksUpdated.next([...this.banks]);
        this.router.navigate(['/']);
      });
  }

}
