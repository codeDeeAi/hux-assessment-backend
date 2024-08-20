export interface IEmailVerificationToken {
    id: number;
    user: string;
    code: string;
    token: string;
    expires_at: string | Date;
    created_at: string | Date;
    updated_at: string | Date;
}