import {createClient} from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

interface CategoryData {
    name: string;
}

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as CategoryData;
    const parsedData = parseData(data);

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

const parseData = (data: CategoryData): CategoryData => {
    return {
        name: data.name.trim() as string,
    }
}

const validateData = (data: Partial<CategoryData>): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (data.name === undefined || data.name?.length < 3 || data.name.length > 30) {
        errors.push("Name entspricht nicht den Anforderungen.");
    }

    return { valid: errors.length === 0, errors };
}

/*
    GET request at /api/category with optional parameters page
    and pageSize. Parameter page starts at 0, so that 0 is the
    first page.
    The default page is 0 and the default page size is 10.
*/
export async function GET() {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('category')
        .select();

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