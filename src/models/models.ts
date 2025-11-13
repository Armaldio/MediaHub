export interface FormattedDetails {
    type: string
    tmdbId: string
    imdbId?: string
    tvdbId?: string
    wikidataId?: string
    facebookId?: string
    instagramId?: string
    twitterId?: string
    title: string
    releaseYear?: string
    rating?: number
    runtime?: string
    genres?: {
        id: number;
        name: string;
    }[]
    overview?: string
}