export interface User {
    id?: string;
    uid: string;
    email: string;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    race: string;
    nationality: string;
    phonenumber?: string;
    location?: Location;
    date: string;
    settings: Settings,
    skills: Skills[]
}

export interface Skills {
    name: string;
    category: string;
    experience: string;
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
    hide_email: boolean,
    hide_phone: boolean,
}