export interface IUserRequestBody {
    id: string;
    fullname: string;
    email: string;
    password: string;
    phone?: string;
    avatar: string;
    role?: string;
    status?: string;
    email_verified: boolean;
    phone_verified: boolean;
  
}
