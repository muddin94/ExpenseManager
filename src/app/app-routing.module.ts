import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { BankListComponent } from './banks/bank-list/bank-list.component';
import { BankCreateComponent } from './banks/bank-create/bank-create.component';

const routes: Routes = [
  { path: '', component: BankListComponent },
  { path: 'create', component: BankCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
