import { Location, User } from "./user";

export interface Service {
    jid?: string;
    uid: string;
    title: string;
    description: string;
    category: string;
    services: string[];
    company: string;
    dateCreated: string;
    location: Location;
    distance?: string;
    postedBy?: string;
}