export interface User {
    id?: string;
    uid: string;
    email: string;
    password?: string;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    race: string;
    phone?: string;
    location?: Location;
    settings: Settings,
    dateCreated: string;
}

export interface Location {
    address: string;
    geo: {
        lat: number,
        lng: number
    }
}

export interface Settings {
    hide_dob: boolean,
    hide_email: boolean,
    hide_phone: boolean,
}