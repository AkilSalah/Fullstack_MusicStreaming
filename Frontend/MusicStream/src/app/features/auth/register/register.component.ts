import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    user = {
      login : '',
      password : '',
      roleNames : ['USER']
    }
    successMessage : string|null = null;
    errorMessage : string|null = null;

    constructor(private authService : AuthService ,private router : Router ){}
    register(){
      this.authService.register(this.user).subscribe({
        next : (respone) =>{
          this.successMessage = 'Registration successful!';
          this.errorMessage = null;
          this.router.navigate(['/home'])
        },
        error : (err) =>{
          this.errorMessage = 'Registration failed: ' + err.error;
          this.successMessage = null;
        }
      })
    }



}
