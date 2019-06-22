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