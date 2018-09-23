import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSubscription : Subscription;

  constructor(public authService: AuthService){

  }

  ngOnInit() {
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

}
