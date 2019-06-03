export interface User {
    uid: string;
    email: string;
    password?: string;
    userType: string;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    nationality: string;
    phonenumber?: string;
    location?: Location;
    dateCreated: string;
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