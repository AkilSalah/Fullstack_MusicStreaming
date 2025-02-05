import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService , private router :Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.router.navigate(['/login']);
    });
  }
}
