import {createClient} from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

interface CategoryPostData {
    name: string;
}

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as CategoryPostData;
    const parsedData = parsePostData(data);

    const {valid, errors} = validateData(parsedData);
    if (!valid) {
        return new NextResponse(errors.join("\n"), {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('category')
        .insert([parsedData]);

    if (error) {
        return new NextResponse("Fehler beim Hinzufügen der Kategorie", {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Kategorie erfolgreich hinzugefügt",
    });
}

const parsePostData = (data: CategoryPostData): CategoryPostData => {
    return {
        name: data.name.trim() as string,
    }
}

interface CategoryPutData {
    id: number;
    name: string;
}

export async function PUT(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as CategoryPutData;
    const parsedData = parsePutData(data);

    const {valid, errors} = validateData(parsedData);
    if (!valid) {
        return new NextResponse(errors.join("\n"), {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('category')
        .update([parsedData])
        .eq('id', parsedData.id);

    console.log(error)

    if (error) {
        return new NextResponse("Fehler beim Bearbeiten der Kategorie", {
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
    }
}

const validateData = (data: Partial<CategoryPostData | CategoryPutData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (data.name === undefined || data.name?.length < 3 || data.name.length > 30) {
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

    if (!data) {
        return new NextResponse("Keine Kategorien gefunden", {
            status: 404,
        });
    }

    if (error) {
        return new NextResponse("Fehler beim Laden der Kategorien", {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
    });
}