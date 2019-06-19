import { Location } from "./user";

export interface Job {
    jid?: string;
    uid: string;
    title: string;
    description: string;
    category: string;
    skills: string[];
    date: string;
    location: Location;
    distance?: string;
}

export interface AppliedJob {
    uid: string;
    id?: string;
    jid: string;
    rid: string;
    date: string;
}

export interface ViewedJob {
    uid: string;
    id?: string;
    jid: string;
    rid: string;
    date: string;
}

export interface SharedJob {
    uid: string;
    id?: string;
    jid: string;
    rid: string;
    dateShared: string;
    platform: string;
} 