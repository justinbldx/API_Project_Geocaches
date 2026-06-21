import { UserSummary } from "./cache.model";

export type NetworkDetail = {
    id: number;
    name: string;
    owner: UserSummary
}

export type NetworkMemberAssignment = {
    network_id: number;
    user_id: number;
}