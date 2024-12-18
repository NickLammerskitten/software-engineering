import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface imageData {
    categoryId: number;
    title: string;
    artist: string;
    description: string;
    imageHeight: number;
    imageWidth: number;
    paperHeight: number;
    paperWidth: number;
    price: number;
    annotations: string;
    image_url: string;
}

interface imageDatabaseData {
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

export async function POST(request: Request) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as imageData;

    const parsedData = parseData(data);

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

const parseData = (data: imageData): imageDatabaseData => {
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
        image_path: data.image_url,
    }
}

const validateData = (data: Partial<imageDatabaseData>): { valid: boolean, errors: string[] } => {
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
    if (typeof data.image_path !== 'string' && data.image_path !== undefined) {
        errors.push("Bild URL muss ein Text oder leer sein.");
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

    if (error) {
        return new NextResponse("Fehler beim Laden der Bilder", {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
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
