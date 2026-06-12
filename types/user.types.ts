export interface IUpdateUserDto {
  name: string;
  email: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface ICreateUserDto {
  name: string;
  email: string;
}

export interface IPartialUpdateUserDto {
  name?: string;
  email?: string;
}
