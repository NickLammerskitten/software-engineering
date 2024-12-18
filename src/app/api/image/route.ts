import { databaseDataToResponseData, postRequestDataToDatabaseData } from "@/src/app/api/image/data-parser";
import { ImageData, ImageDatabaseData, ImageDatabaseResponseData } from "@/src/app/api/models/image.model";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as ImageData;
    const parsedData = postRequestDataToDatabaseData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return new NextResponse(errors.join("\n"), {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('image')
        .insert([parsedData]);

    if (error) {
        return new NextResponse("Fehler beim Hinzufügen des Bildes", {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Bild erfolgreich hinzugefügt",
    });
}

const validateData = (data: Partial<ImageDatabaseData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (typeof data.category_id !== 'number' || data.category_id <= 0) {
        errors.push("Kategorieauswahl fehlerhaft.");
    }
    if (typeof data.title !== 'string' || data.title.trim() === "") {
        errors.push("Der Titel muss ein nicht-leerer Text sein.");
    }
    if (typeof data.artist !== 'string' || data.artist.trim() === "") {
        errors.push("Der Künstler muss ein nicht-leerer Text sein.");
    }
    if (typeof data.description !== 'string' && data.description !== undefined) {
        errors.push("Beschreibung muss ein Text oder leer sein.");
    }
    if (typeof data.image_height !== 'number' || data.image_height <= 0) {
        errors.push("Bildhöhe muss eine positive Zahl sein.");
    }
    if (typeof data.image_width !== 'number' || data.image_width <= 0) {
        errors.push("Bildbreite muss eine positive Zahl sein.");
    }
    if (typeof data.paper_height !== 'number' || data.paper_height <= 0) {
        errors.push("Papierhöhe muss eine positive Zahl sein.");
    }
    if (typeof data.paper_width !== 'number' || data.paper_width <= 0) {
        errors.push("Papierbreite muss eine positive Zahl sein.");
    }
    if (typeof data.price !== 'number' || data.price < 0) {
        errors.push("Preis muss eine nicht-negative Zahl sein.");
    }
    if (typeof data.annotations !== 'string' && data.annotations !== undefined) {
        errors.push("Anmerkungen müssen ein Text oder leer sein.");
    }

    return { valid: errors.length === 0, errors };
};

const DEFAULT_PAGE_SIZE = 10;

interface GetImagesRequest {
    page: number;
    pageSize: number;
}

/*
    GET request at /api/gallery with optional parameters page
    and pageSize. Parameter page starts at 0, so that 0 is the
    first page.
    The default page is 0 and the default page size is 10.
*/
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? 0);
    const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

    const getImagesRequest = {
        page,
        pageSize,
    } as GetImagesRequest;

    const { valid, errors } = validateGetImagesRequest(getImagesRequest);
    if (!valid) {
        return new NextResponse(errors.join("\n"), {
            status: 400,
        });
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('image')
        .select()
        .range(page*pageSize, page*pageSize+pageSize-1);

    if (!data) {
        return new NextResponse("Keine Bilder gefunden", {
            status: 404,
        });
    }

    const parsedData = data.map((image: ImageDatabaseResponseData) => {
        return databaseDataToResponseData(image);
    });

    if (error) {
        return new NextResponse("Fehler beim Laden der Bilder", {
            status: 500,
        });
    }

    return NextResponse.json({
        data: parsedData,
    });
}

const validateGetImagesRequest = (data: GetImagesRequest): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (data.page < 0) {
        errors.push("Seite muss eine positive Zahl sein.");
    }
    if (data.pageSize <= 0) {
        errors.push("Seitengröße muss eine positive Zahl sein.");
    }

    return { valid: errors.length === 0, errors };
}
