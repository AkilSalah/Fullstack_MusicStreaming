import { Component } from '@angular/core';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/userManagement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  users : any[] =[]
  constructor(private userManagement : UserService){}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() : void{
    this.userManagement.getUsers().subscribe({
      next : (data) =>{
        this.users = data.content
        console.log("hey",this.users)
      },
      error : (error) =>{
        console.error('Erreur lors du chargement des users :', error);
      },
    });
  }

  deleteUser(id : string) :void{
    if(confirm("Are u sure you want to delete this user ??")){
    this.userManagement.deleteUser(id).subscribe({
      next : ()=>{
        console.log("deleted succesfuly")
        this.loadUsers()
      },
      error : (err)=>{
        console.log("error lors de la suppression de user",err)
      }
    })
  }
}
}
