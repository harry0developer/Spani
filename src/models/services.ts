import { Location, User } from "./user";

export interface Service {
    id?: string;
    uid: string;
    title: string;
    icon: string;
    description: string;
    category: string;
    services: string[];
    company: string;
    dateCreated: string;
    location: Location;
    distance?: string;
    postedBy?: string;
}


export interface UserAction {
    uid: string; // user posted
    xid: string; // user viewed
    sid: string; // service id
    date: string;
}
