export interface Contacts {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    created_on: string;
    status: string;
    avatar: string;

    [key: string]: number | string;

}