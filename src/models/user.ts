export interface User {
    uid: string;
    email: string;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    gender: string;
    phone?: string;
    location?: Location;
    date: string;
    settings: Settings
}

export interface Location {
    address: string;
    geo: {
        lat: string,
        lng: string
    }
}


export interface Settings {
    hide_dob: boolean,
    hide_phone: boolean
}