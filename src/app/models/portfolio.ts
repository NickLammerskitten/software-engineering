export interface Portfolio {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
}

export interface ImageConfiguration {
    id: string;
    imageId: string;
    portfolioId: string | null;
    byTrader: boolean;
    paletteId: string | null;
    stripId: string | null;
    passepartout: boolean;
}