import { ImageDatabaseResponseData, ImageResponseData } from "@/src/app/api/models/image.model";

export interface ImageConfigurationData {
    imageId: string;
    portfolioId: string;
}

export interface ImageConfigurationResponseData extends ImageResponseData, ImageConfigurationData {
    id: string;
    byTrader: boolean;
}

export interface ImageConfigurationDatabaseData {
    image_id: string;
    portfolio_id: string;
    by_trader: boolean;
}

export interface ImageConfigurationDatabaseResponseData extends ImageDatabaseResponseData, ImageConfigurationDatabaseData {
    id: string;
}