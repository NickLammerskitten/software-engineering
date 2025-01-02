export interface ImageConfigurationData {
    imageId: string;
    portfolioId: string;
    paletteId: string | null;
    stripId: string | null;
    passepartout: boolean;
}

export interface ImageConfigurationDatabaseData {
    image_id: string;
    portfolio_id: string;
    by_trader: boolean;
    palette_id: string | null;
    strip_id: string | null;
    passepartout: boolean;
}