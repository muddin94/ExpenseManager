import { Router } from '@angular/router';
import { Bank } from './bank.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class BanksService {
  private banks: Bank[] = [];
  private banksUpdated = new Subject<{banks: Bank[],bankCount: number}>();

  constructor(private http: HttpClient, private router:Router) {}

  getBanks(banksPerPage: number, currentPage: number) {
    const queryParams =`?pagesize=${banksPerPage}&page=${currentPage}`;
    this.http.get<{message: string, banks: any, maxBanks: number }>('http://localhost:3000/api/banks' + queryParams)
      .pipe(map((bankData) => {
        return { banks: bankData.banks.map(bank => {
          return {
            name: bank.name,
            value: bank.value,
            id: bank._id,
            imagePath: bank.imagePath
          };
        }),
        maxBanks: bankData.maxBanks
      };
      }))
      .subscribe((transformedBankData) => {
        this.banks = transformedBankData.banks;
        this.banksUpdated.next({
          banks: [...this.banks],
          bankCount: transformedBankData.maxBanks
        });
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
        this.router.navigate(['/']);
      });

  }

  deleteBank(bankId: string) {
    return this.http.delete('http://localhost:3000/api/banks/' + bankId);
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
        this.router.navigate(['/']);
      });
  }

}
