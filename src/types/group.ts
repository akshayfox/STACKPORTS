

export interface Group {
  _id?:string;
  client: any;
  name: string;
  email: string;
  password: string;
  subGroupTitle?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
