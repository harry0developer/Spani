import { Location, User } from "./user";

export interface Service {
    jid?: string;
    uid: string;
    title: string;
    description: string;
    category: string;
    skills: string[];
    type: string;
    date: string;
    location: Location;
    distance?: string;
    postedBy?: string;
    users?: User[];
}