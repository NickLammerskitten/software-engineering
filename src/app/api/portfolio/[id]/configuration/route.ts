import { ImageConfigurationResponseData } from "@/src/app/api/models/image-configuration.model";
import { getSignedUrl } from "@/src/utils/supabase/public-image-url-fetcher";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface ImageConfigurationDatabaseData {
    id: string;
    by_trader: boolean;
    palette_id: string;
    image: {
        id: string;
        title: string;
        artist: string;
        image_path: string | null;
        price: number;
    }
}

export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const portfolioId = requestParams[5];
    if (!portfolioId) {
        return NextResponse.json({ message: "Keine Portfolio id angegeben." }, {
            status: 400,
        })
    }

    const supabaseClient = createClient();

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
        return NextResponse.json({ message: "Nicht authentifiziert" }, {
            status: 401,
        });
    }

    const { data, error } = await supabaseClient
        .from('image_configuration')
        .select(`
            id,
            by_trader,
            palette_id,
            image (
                id,
                title,
                artist,
                image_path,
                price
            )
        `)
        .eq('portfolio_id', portfolioId);

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Bilder" }, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({ message: "Keine Bilder gefunden" }, {
            status: 404,
        });
    }

    const parsedData = [];
    for (const imageConfiguration of data) {
        parsedData.push(await databaseDataToResponseData(imageConfiguration as unknown as ImageConfigurationDatabaseData));
    }

    return NextResponse.json({
        data: parsedData,
    });
}

const databaseDataToResponseData = async (data: ImageConfigurationDatabaseData): Promise<ImageConfigurationResponseData> => {
    let publicImageUrl = null;
    if (data.image.image_path) {
        publicImageUrl = await getSignedUrl(data.image.image_path);
    }

    let price = data.image.price;
    if (data.palette_id !== null) {
        price = price * 1.15;
    }

    return {
        id: data.id,
        byTrader: data.by_trader,
        imageId: data.image.id,
        title: data.image.title,
        artist: data.image.artist,
        imageUrl: publicImageUrl,
        imagePrice: price,
    }
}