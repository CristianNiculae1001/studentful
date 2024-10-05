export interface UserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export interface VerifyTokenPayload {
    email: string;
    token: string;
};