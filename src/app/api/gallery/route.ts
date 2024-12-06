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

interface imageDatabaseData {
    category_id: number;
    title: string;
    description: string | null;
    image_height: number | null;
    image_width: number | null;
    paper_height: number | null;
    paper_width: number | null;
    price: number;
    annotations: string | null;
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

const parseData = (data: imageData): imageDatabaseData => {
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

const validateData = (data: Partial<imageDatabaseData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (typeof data.category_id !== 'number' || data.category_id <= 0) {
        errors.push("Kategorieauswahl fehlerhaft.");
    }
    if (typeof data.title !== 'string' || data.title.trim() === "") {
        errors.push("Der Titel muss ein nicht-leerer Text sein.");
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
