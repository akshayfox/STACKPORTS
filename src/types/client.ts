export interface Client {
  _id: string;
  fullname: string;
  place: string;
  contact: string;
  password: string;
  grouptitle: string;
  template: any;
  isActive: boolean;
  username:string;
  createdAt?: string;
  updatedAt?: string;
}