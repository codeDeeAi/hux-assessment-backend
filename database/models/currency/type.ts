export interface ICurrency {
    id: number;
    iso: string;
    name: string;
    details: { [key: string]: any } | null;
    created_at: string | Date;
    updated_at: string | Date;
}
