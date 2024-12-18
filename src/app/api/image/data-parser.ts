import { getSignedUrl } from "@/src/app/api/image/public-image-url-fetcher";
import {
    ImageData,
    ImageDatabaseData,
    ImageDatabaseResponseData,
    ImageResponseData,
} from "@/src/app/api/models/image.model";

export const databaseDataToResponseData = async (data: ImageDatabaseResponseData): Promise<ImageResponseData> => {
    let publicImageUrl = null;
    if (data.image_path) {
        publicImageUrl = await getSignedUrl(data.image_path);
    }

    return {
        id: data.id,
        categoryId: data.category_id,
        title: data.title,
        artist: data.artist,
        description: data.description,
        imageHeight: data.image_height,
        imageWidth: data.image_width,
        paperHeight: data.paper_height,
        paperWidth: data.paper_width,
        price: data.price,
        annotations: data.annotations,
        image_url: publicImageUrl,
    }
}

export const postRequestDataToDatabaseData = (data: ImageData): ImageDatabaseData => {
    return {
        category_id: parseInt(data.categoryId as unknown as string),
        title: data.title as string,
        artist: data.artist as string,
        description: data.description as string ?? null,
        image_height: parseFloat(data.imageHeight as unknown as string) ?? null,
        image_width: parseFloat(data.imageWidth as unknown as string) ?? null,
        paper_height: parseFloat(data.paperHeight as unknown as string) ?? null,
        paper_width: parseFloat(data.paperWidth as unknown as string) ?? null,
        price: parseFloat(data.price as unknown as string),
        annotations: data.annotations as string ?? null,
        image_path: data.image_url as string ?? null,
    }
}