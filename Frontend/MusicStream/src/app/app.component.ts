import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MusicStream';
  showNavbarAndFooter : boolean = true;
  constructor(private router: Router){
    this.router.events.subscribe(()=>{
      this.showNavbarAndFooter = this.router.url !== '/'
    })
  }
}
