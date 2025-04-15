export interface Client {
  _id: string;
  fullname: string;
  place: string;
  contact: string;
  grouptitle: string;
  template: any;
  isActive: boolean;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}