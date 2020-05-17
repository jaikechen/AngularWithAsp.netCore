import { BaseModel } from "../../_core/crud/base.model";

export class User extends BaseModel{
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  password: string;
}
