export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface CacheSummary {
    id: number;
    coordinates: Coordinates;
    type: string;
    state: string;
    description: string;
    descriptionLibre: string | null;
    descriptionTechnique: string;
}

export interface CacheDetail extends CacheSummary {
    network: {
        id: number;
        name: string;
    };
}

export interface UserSummary {
    id: number;
    role: 'user' | 'admin';
    username: string;
}

export interface VisitSummaryWithoutCache {
    user: UserSummary;
    found: boolean;
    visited_at: string;
    comment: string | null;
    photo_url: string | null;
}
