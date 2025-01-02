export interface Image {
    id: string;
    categoryId: number;
    title: string;
    description: string | null;
    imageHeight: number | null;
    imageWidth: number | null;
    paperHeight: number | null;
    paperWidth: number | null;
    annotations: string | null;
    price: number;
    artist: string | null;
    image_url: string | null;
}