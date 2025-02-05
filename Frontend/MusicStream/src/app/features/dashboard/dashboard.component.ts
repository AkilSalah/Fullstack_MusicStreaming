import { Component } from '@angular/core';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/userManagement.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  users : any[] =[]
  allRoles: string[] = ['ADMIN', 'USER'];
  selectedUser: any = null;
  selectedRoles: string[] = [];
  isEditModalOpen: boolean = false;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private userManagement : UserService, private auth :AuthService){}

  ngOnInit(): void {
    this.loadUsers();
    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAdmin = this.auth.isAdmin();
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

openEditRolesModal(user: any) {
  this.selectedUser = user;
  this.selectedRoles = user.roles.map((role: any) => role.name);
  this.isEditModalOpen = true;
}

closeEditModal() {
  this.isEditModalOpen = false;
  this.selectedUser = null;
  this.selectedRoles = [];
}

toggleRole(role: string) {
  if (this.selectedRoles.includes(role)) {
    this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
  } else {
    this.selectedRoles.push(role);
    
  } 
}

updateRoles() {
  if (this.selectedUser) {
    this.userManagement.updateUserRoles(this.selectedUser.id, this.selectedRoles).subscribe({
      next: (updatedUser) => {
        console.log("User roles updated:", updatedUser)
        this.loadUsers()
        this.closeEditModal()
      },
      error: (error) => {
        console.error("Error updating user roles:", error)
      },
    })
  }
}
}
