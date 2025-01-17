export interface ImageData {
    categoryId: number;
    title: string;
    artist: string;
    description: string | null;
    imageHeight: number | null;
    imageWidth: number | null;
    paperHeight: number | null;
    paperWidth: number | null;
    price: number;
    annotations: string | null;
    image_url: string | null;
}

export interface ImageResponseData extends ImageData {
    id: string;
    standardConfigurationId: string | null;
}

export interface ImageDatabaseData {
    category_id: number;
    title: string;
    artist: string;
    description: string | null;
    image_height: number | null;
    image_width: number | null;
    paper_height: number | null;
    paper_width: number | null;
    price: number;
    annotations: string | null;
    image_path: string | null;
}

export interface ImageDatabaseResponseData extends ImageDatabaseData {
    id: string;
    image_configuration: [{id: string | null}];
}