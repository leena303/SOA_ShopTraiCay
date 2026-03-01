export class User {
  id?: number;
  username: string;
  email: string;
  role?: string;
  status?: string;
  address?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: any = {}) {
    this.id = data.id;
    this.username = data.username || data.userName || '';
    this.email = data.email || data.username || data.userName || '';
    this.role = data.role || 'customer';
    this.status = data.status || 'active';
    this.address = data.address;
    this.password = data.password;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
  }
} 