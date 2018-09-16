import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component } from "@angular/core";


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  isLoading = false;

  constructor(public authService:AuthService){}

  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

}
