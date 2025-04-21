

export interface Group {
  _id?:string;
  client: any;
  fullname: string;
  username: string;
  password: string;
  subGroupTitle?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
