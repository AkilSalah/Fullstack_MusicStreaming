import { Component } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAdmin: boolean = false;
  
  constructor(private authService : AuthService ,private router : Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }
  
  logout(): void {
    const token = localStorage.getItem('token'); 

    if (token) {
      this.authService.logout(token).subscribe({
        next: () => {
          localStorage.removeItem('token'); 
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error("Erreur lors de la déconnexion :", err);
        }
      });
    } else {
      console.warn("Aucun token trouvé !");
      this.router.navigate(['/login']);
    }
  }

  
}
