import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";
import {StripData} from "@/src/app/api/models/strip.model";

/*
    GET request at /api/strip
*/
export async function GET() {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('strip')
        .select()
        .order('id');

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Leistenfarben: " + error.message }, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({ message: "Keine Leistenfarbe gefunden" }, {
            status: 404,
        });
    }

    return NextResponse.json({
        data: data,
    });
}

/*
    POST request at /api/strip
*/
export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as StripData;
    const parsedData = parsePostData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('strip')
        .insert(parsedData);

    if (error) {
        return NextResponse.json({ message: `Fehler beim Hinzufügen der Leiste, ${error.details}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Leiste erfolgreich hinzugefügt",
    });
}

const parsePostData = (data: StripData): StripData => {
    return {
        name: data.name.trim() as string,
    }
}

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$');
const validateData = (data: Partial<StripData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (data.name === undefined || !nameRegEx.test(data.name)) {
        errors.push("Name entspricht nicht den Anforderungen.");
    }

    return { valid: errors.length === 0, errors };
}

interface StripPutData {
    id: number;
    name: string;
}

export async function PUT(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as StripPutData;
    const parsedData = parsePutData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('strip')
        .update(parsedData)
        .eq('id', parsedData.id);

    if (error) {
        return NextResponse.json({ message: `Fehler beim Bearbeiten der Leiste, ${error.message}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Leiste erfolgreich bearbeitet",
    });
}

const parsePutData = (data: StripPutData): StripPutData => {
    return {
        id: data.id as number,
        name: data.name.trim() as string,
    }
}
