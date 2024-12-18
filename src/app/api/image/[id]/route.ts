import { ImageDatabaseResponseData, ImageResponseData } from "@/src/app/api/models/image.model";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/*
    GET request at /api/category with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const imageId = requestParams[5];
    if (!imageId) {
        return NextResponse.json({message: "Keine Bild id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('image')
        .select()
        .eq('id', imageId)
        .single();

    if (!data) {
        return NextResponse.json({message: "Kein Bild gefunden"}, {
            status: 404,
        });
    }

    const parsedData = parseData(data);

    if (error) {
        return NextResponse.json({message: "Fehler beim Laden des Bildes"}, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: parsedData,
    });
}

const parseData = (data: ImageDatabaseResponseData): ImageResponseData => {
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
        annotations: data.annotations
    }
}