import {
    ImageData,
    ImageDatabaseData,
    ImageDatabaseResponseData,
    ImageResponseData,
} from "@/src/app/api/models/image.model";
import { getSignedUrl } from "@/src/utils/supabase/public-image-url-fetcher";

export const databaseDataToResponseData = async (data: ImageDatabaseResponseData): Promise<ImageResponseData> => {
    let publicImageUrl = null;
    if (data.image_path) {
        publicImageUrl = await getSignedUrl(data.image_path);
    }

    let standardConfigurationId = null;
    if (data.image_configuration && data.image_configuration.length > 0) {
        standardConfigurationId = data.image_configuration[0].id;
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
        standardConfigurationId: standardConfigurationId,
    }
}

export const postRequestDataToDatabaseData = (data: ImageData): ImageDatabaseData => {
    return {
        category_id: parseInt(data.categoryId.toString()),
        title: data.title,
        artist: data.artist,
        description: data.description,
        image_height: data.imageHeight ? parseFloat(data.imageHeight.toString()) : null,
        image_width: data.imageWidth ? parseFloat(data.imageWidth.toString()) : null,
        paper_height: data.paperHeight ? parseFloat(data.paperHeight.toString()) : null,
        paper_width: data.paperWidth ? parseFloat(data.paperWidth.toString()) : null,
        price: parseFloat(data.price.toString()),
        annotations: data.annotations,
        image_path: data.image_url,
    }
}

export const putRequestDataToDatabaseData = (data: ImageResponseData): ImageDatabaseResponseData => {
    return {
        id: data.id,
        category_id: parseInt(data.categoryId.toString()),
        title: data.title,
        artist: data.artist,
        description: data.description,
        image_height: data.imageHeight ? parseFloat(data.imageHeight.toString()) : null,
        image_width: data.imageWidth ? parseFloat(data.imageWidth.toString()) : null,
        paper_height: data.paperHeight ? parseFloat(data.paperHeight.toString()) : null,
        paper_width: data.paperWidth ? parseFloat(data.paperWidth.toString()) : null,
        price: parseFloat(data.price.toString()),
        annotations: data.annotations,
        image_path: data.image_url,
        image_configuration: [{ id: data.standardConfigurationId }],
    }
}