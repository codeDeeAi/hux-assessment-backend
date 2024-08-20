export interface ITimestamps {
    created_at: string | Date;
    updated_at: string | Date;
}

export interface PhoneNumber {
    countryCode: string;
    phoneNumber: string;
}
export interface PhoneNumberWithNormalizedNumber extends PhoneNumber {
    normalizedNumber: string;
}