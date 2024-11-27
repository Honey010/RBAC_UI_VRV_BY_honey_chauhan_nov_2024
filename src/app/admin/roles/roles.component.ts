import { Component, OnInit } from '@angular/core';
import { RoleService } from '@app/_services/role.service';
import { first } from 'rxjs';
import { Role2 } from '@app/_models';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less']
})
export class RolesComponent implements OnInit {

  roles: Role2[] = []
  isNewRole = false;
  tempNewRole!: Role2
  newRole: Role2 = {
    id: 0,
    role: '',
    permissions: {
      read: false,
      write: false,
      delete: false,
    }
  }
  editRoleId: number = 0;
  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService
      .getAll()
      .pipe(first())
      .subscribe((roles) => {
        this.roles = roles;
      });
  }

  createRole(){
    this.isNewRole = true;
    this.tempNewRole = {...this.newRole}
    this.tempNewRole.permissions = {...this.newRole.permissions}
    console.log(this.tempNewRole)
  }

  insertNewRole(){
    this.tempNewRole.id = this.roles[this.roles.length - 1].id + 1;
    this.roles.push({...this.tempNewRole});
    this.isNewRole = false;
    this.tempNewRole = {...this.newRole}
  }

  updateRole(role: Role2){
    alert('Permissions has been updated for: ' + role.role)
  }

  updateRoleName(role: Role2){
    this.editRoleId = 0;
    alert('Role Name has been updated to: ' + role.role)
  }

  editRole(id: number){
    this.editRoleId = id;
  }

  deleteRole(index: number){
    if (index >= 0 && index < this.roles.length) {
      this.roles.splice(index, 1); // should be replaced with service function with api call
      alert('Role has been removed')
    } else {
      alert("Invalid index");
    }
  }

}
