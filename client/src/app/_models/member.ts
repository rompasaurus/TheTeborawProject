import { Photo } from "./Photo";

export interface Member {
    id: number;
    userName: string;
    age: number;
    knownAs: string;
    created: string;
    lastActive: string;
    gender: string;
    introduction: string;
    country: string;
    city: string;
    interests: string;
    lookingFor: string;
    photos: Photo[];
    photoUrl: string;
}

