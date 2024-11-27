export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface Role2 {
  id: number;
  role: string;
  permissions: {
    read: boolean,
    write: boolean,
    delete: boolean
  }
}
