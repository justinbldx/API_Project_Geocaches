export interface Visit {
    cache_id: number;
    found: boolean;
    comment?: string;
    visited_at: Date;
    photo_url?: string;
}

export interface DetailedVisit extends Visit {
    cache: {
        id: number;
        coordinates: {
            latitude: number;
            longitude: number;
        }
        type: string;
        state: string;
        description: string;
        descriptionLibre: string;
        descriptionTechnique: string;
    }
}
