export interface PhoneDATA {
    country?: string;
    dialCode?: string | number;
    nationalNumber?: string | number;
    number?: string | number;
    isValid?: boolean;
}

export type Country = {
    name: string;
    dialCode: string;
    iso2: string;
}