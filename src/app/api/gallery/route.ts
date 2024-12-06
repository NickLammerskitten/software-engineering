import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

interface imageData {
    categoryId: number;
    title: string;
    description: string;
    imageHeight: number;
    imageWidth: number;
    paperHeight: number;
    paperWidth: number;
    price: number;
    annotations: string;
}

interface getImagesRequest {
    page: number;
    pageSize: number;
    filter: string;
}

export async function GET(request: Request) {
    const requestParams = request.url.split("?")[1];
    const params = new URLSearchParams(requestParams);
    const page = parseInt(params.get("page") ?? "1");
    const pageSize = parseInt(params.get("pageSize") ?? "10");
    const filter = params.get("filter") ?? "";

    const getImageRequestData = {
        page,
        pageSize,
        filter,
    } as getImagesRequest;

    const { valid, errors } = validateGetImagesRequest(getImageRequestData);
    if (!valid) {
        return new NextResponse(errors.join("\n"), {
            status: 400,
        });
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('images')
        .select();

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
        .from('images')
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

const validateGetImagesRequest = (data: getImagesRequest): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (typeof data.page !== 'number' || data.page <= 0) {
        errors.push("Seite muss eine positive Zahl sein.");
    }
    if (typeof data.pageSize !== 'number' || data.pageSize <= 0) {
        errors.push("Seitengröße muss eine positive Zahl sein.");
    }
    if (typeof data.filter !== 'string') {
        errors.push("Filter muss ein Text sein.");
    }

    return { valid: errors.length === 0, errors };
}

const parseData = (data: imageData) => {
    return {
        category_id: parseInt(data.categoryId as unknown as string),
        title: data.title as string,
        description: data.description as string ?? null,
        image_height: parseFloat(data.imageHeight as unknown as string) ?? null,
        image_width: parseFloat(data.imageWidth as unknown as string) ?? null,
        paper_height: parseFloat(data.paperHeight as unknown as string) ?? null,
        paper_width: parseFloat(data.paperWidth as unknown as string) ?? null,
        price: parseFloat(data.price as unknown as string),
        annotations: data.annotations as string ?? null,
    }
}

const validateData = (data: Partial<imageData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (typeof data.categoryId !== 'number' || data.categoryId <= 0) {
        errors.push("Kategorieauswahl fehlerhaft.");
    }
    if (typeof data.title !== 'string' || data.title.trim() === "") {
        errors.push("Der Titel muss ein nicht-leerer Text sein.");
    }
    if (typeof data.description !== 'string' && data.description !== undefined) {
        errors.push("Beschreibung muss ein Text oder leer sein.");
    }
    if (typeof data.imageHeight !== 'number' || data.imageHeight <= 0) {
        errors.push("Bildhöhe muss eine positive Zahl sein.");
    }
    if (typeof data.imageWidth !== 'number' || data.imageWidth <= 0) {
        errors.push("Bildbreite muss eine positive Zahl sein.");
    }
    if (typeof data.paperHeight !== 'number' || data.paperHeight <= 0) {
        errors.push("Papierhöhe muss eine positive Zahl sein.");
    }
    if (typeof data.paperWidth !== 'number' || data.paperWidth <= 0) {
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
