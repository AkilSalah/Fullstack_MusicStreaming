import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
user = {
  email : '',
  password :''
};
errorMessage : string | null = null;
constructor(private authService :  AuthService , private router : Router){}
login(){
  this.authService.login(this.user).subscribe({
    next : (response) => {
      localStorage.setItem('token',response.token);
      this.router.navigate(['/home']);
    },
    error:(err) =>{
      this.errorMessage = 'login failed : ' +err.console.error;
      
    },
  });
}
}
