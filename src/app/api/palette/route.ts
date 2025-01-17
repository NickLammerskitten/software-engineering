import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";
import {PaletteData} from "@/src/app/api/models/palette.model";

/*
    GET request at /api/palette
*/
export async function GET() {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('palette')
        .select()
        .order('id');

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Paletten" + error.message }, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({ message: "Keine Palette gefunden" }, {
            status: 404,
        });
    }


    return NextResponse.json({
        data: data,
    });
}

/*
    POST request at /api/palette
*/
export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as PaletteData;
    const parsedData = parsePostData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('palette')
        .insert(parsedData);

    if (error) {
        return NextResponse.json({ message: `Fehler beim Hinzufügen der Palette, ${error.message}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Palette erfolgreich hinzugefügt",
    });
}

const parsePostData = (data: PaletteData): PaletteData => {
    return {
        name: data.name.trim() as string,
    }
}

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$');
const validateData = (data: Partial<PaletteData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (data.name === undefined || !nameRegEx.test(data.name)) {
        errors.push("Name entspricht nicht den Anforderungen.");
    }

    return { valid: errors.length === 0, errors };
}

interface PalettePutData {
    id: number;
    name: string;
}

export async function PUT(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as PalettePutData;
    const parsedData = parsePutData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('palette')
        .update(parsedData)
        .eq('id', parsedData.id);

    if (error) {
        return NextResponse.json({ message: `Fehler beim Bearbeiten der Palette, ${error.message}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Palette erfolgreich bearbeitet",
    });
}

const parsePutData = (data: PalettePutData): PalettePutData => {
    return {
        id: data.id as number,
        name: data.name.trim() as string,
    }
}
