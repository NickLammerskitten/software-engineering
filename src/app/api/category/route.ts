import { CategoryData } from "@/src/app/api/models/category.model";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as CategoryData;
    const parsedData = parsePostData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('category')
        .insert([parsedData]);

    if (error) {
        return NextResponse.json({ message: `Fehler beim Hinzufügen der Kategorie, ${error.details}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Kategorie erfolgreich hinzugefügt",
    });
}

const parsePostData = (data: CategoryData): CategoryData => {
    return {
        name: data.name.trim() as string,
    }
}

interface CategoryPutData {
    id: number;
    name: string;
    updated_at: Date
}

export async function PUT(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as CategoryPutData;
    const parsedData = parsePutData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('category')
        .update([parsedData])
        .eq('id', parsedData.id);

    if (error) {
        return NextResponse.json({ message: `Fehler beim Bearbeiten der Kategorie, ${error.details}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Kategorie erfolgreich bearbeitet",
    });
}

const parsePutData = (data: CategoryPutData): CategoryPutData => {
    return {
        id: data.id as number,
        name: data.name.trim() as string,
        updated_at: new Date(),
    }
}

const validateData = (data: Partial<CategoryData | CategoryPutData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (data.name === undefined || !nameRegEx.test(data.name)) {
        errors.push("Name entspricht nicht den Anforderungen.");
    }

    return { valid: errors.length === 0, errors };
}

/*
    GET request at /api/category
*/
export async function GET() {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('category')
        .select()
        .order('id');

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Kategorien" + error.message }, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({ message: "Keine Kategorien gefunden" }, {
            status: 404,
        });
    }

    return NextResponse.json({
        data: data,
    });
}