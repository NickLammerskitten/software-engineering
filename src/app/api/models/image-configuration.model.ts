export interface ImageConfigurationData {
    imageId: string;
    portfolioId: string;
    paletteId: string | null;
    stripColorId: string | null;
    passepartout: boolean;
}

export interface ImageConfigurationDatabaseData {
    image_id: string;
    portfolio_id: string;
    by_trader: boolean;
    palette_id: string | null;
    strip_color_id: string | null;
    passepartout: boolean;
}