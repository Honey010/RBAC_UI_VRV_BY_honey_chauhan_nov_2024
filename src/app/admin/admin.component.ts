import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/_services';
import { RoleService } from '@app/_services/role.service';
import { User } from '@app/_models';
import { Role2 } from '@app/_models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[] = [];
  roles: Role2[] = [];
  loading = false;
  currentUserId?: number;
  editUserId = 0;
  newUser: User = {
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    role_id: 0,
    role: null
  }
  tempUser!: User;
  isNewUser = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe((users) => {
      this.users = users;
      this.loading = false;
    });
  }

  loadRoles() {
    this.roleService.getAll().subscribe((roles) => {
      this.roles = roles;
    });
  }

  // Function to edit a user
  editUser(user_id: number) {
    this.editUserId = user_id;
  }

  addUser() {
    this.isNewUser = true;
    this.tempUser = {...this.newUser};
  }

  insertNewUser(){
    this.tempUser.id = this.users[this.users.length - 1].id + 1;
    this.users.push({...this.tempUser});
    this.isNewUser = false;
    this.tempUser = {...this.newUser}
  }

  updateUser(user:User){
    this.editUserId = 0;
    alert('User with username:- '+ user.username +' has been updated')
  }

  // Function to delete a user
  deleteUser(index: number) {
    if (confirm('Are you sure you want to delete user?')) {
      // this.userService.delete(id).subscribe(() => this.loadUsers());
      if (index >= 0 && index < this.users.length) {
        this.users.splice(index, 1); // should be replaced with service function with api call
        alert('User has been removed')
      } else {
        alert("Invalid index");
      }
    }
  }
}
