import {
    databaseDataToResponseData,
    postRequestDataToDatabaseData,
    putRequestDataToDatabaseData
} from "@/src/app/api/image/data-parser";
import {
    ImageData,
    ImageDatabaseData,
    ImageDatabaseResponseData,
    ImageResponseData
} from "@/src/app/api/models/image.model";
import { createClient } from "@/src/utils/supabase/server";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../../models/user-role";

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as ImageData;
    const parsedData = postRequestDataToDatabaseData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { data: result, error } = await supabaseClient
        .from('image')
        .insert(parsedData)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ message: `Fehler beim Hinzufügen des Bildes, ${error.details}` }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Bild erfolgreich hinzugefügt",
        data: result,
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
    if ((typeof data.image_height !== 'number' || data.image_height <= 0) && data.image_height !== null) {
        errors.push("Bildhöhe muss eine positive Zahl sein.");
    }
    if ((typeof data.image_width !== 'number' || data.image_width <= 0) && data.image_width !== null) {
        errors.push("Bildbreite muss eine positive Zahl sein.");
    }
    if ((typeof data.paper_height !== 'number' || data.paper_height <= 0) && data.paper_height !== null) {
        errors.push("Papierhöhe muss eine positive Zahl sein.");
    }
    if ((typeof data.paper_width !== 'number' || data.paper_width <= 0) && data.paper_width !== null) {
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
    category: string[];
    query: string;
}

function decodeQueryParam(p: string) {
    return decodeURIComponent(p.replace(/\+/g, " "));
}

/*
    method: GET
    route: /api/image
    parameters:
    - page
        Number indicating page to be fetched
        default: 0
    - pageSize
        Number determining the page size
        default: 10
    - category
        Comma separated list of category names to filter for
        default: ""
    - query
        Query string to filter title and artist by
        default: ""
*/
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? 0);
    const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);
    const category = (searchParams.get("category") ?? "").split(",");
    const searchQuery = decodeQueryParam(searchParams.get("query") ?? "");

    const getImagesRequest = {
        page: page,
        pageSize: pageSize,
        category: category,
        query: searchQuery
    } as GetImagesRequest;

    const { valid, errors } = validateGetImagesRequest(getImagesRequest);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const supabaseClient = createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    const categories = await getCategoryByName(supabaseClient, category);
    if (categories.error) {
        return NextResponse.json({message: categories.error?.message}, {status: 500});
    }
    if (categories.category === null) {
        return NextResponse.json({message: `Keine Kategorien mit Namen '${category}' gefunden`}, {status: 404})
    }
    const category_ids = categories.category.map(c => c.id);

    const useOriginalFilter = user === null || user?.role !== UserRole.Trader;

    const { data, error, count } = await getImages(supabaseClient, page, pageSize, category_ids, searchQuery, useOriginalFilter);

    if (error) {
        return NextResponse.json({message: "Fehler beim Laden der Bilder: " + error.message}, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({message: "Keine Bilder gefunden"}, {
            status: 404,
        });
    }

    const parsedData = [];
    for (const image of data) {
        parsedData.push(await databaseDataToResponseData(image));
    }

    return NextResponse.json({
        data: parsedData,
        page: page,
        pageSize: pageSize,
        total: count,
    });
}

async function getImages(
    client: SupabaseClient,
    page: number,
    pageSize: number,
    category_id_filter?: number[],
    query_filter?: string,
    original_filter?: boolean
): Promise<{data: ImageDatabaseResponseData[] | null, error: PostgrestError | null, count: number | null}> {
    let query = client.from("image").select("*", {count: "exact"});

    if (category_id_filter && category_id_filter.length > 0) {
        query = query.in("category_id", category_id_filter);
    }

    if (query_filter && query_filter !== "") {
        query = query.or(`title.ilike.%${query_filter}%,artist.ilike.%${query_filter}%`)
    }

    if (original_filter) {
        const { data: trader_assigned_originals, error } = await client.from("trader_assigned_originals").select("id");
        if (error) {
            return {data: null, error: error, count: null};
        }
        if (trader_assigned_originals.length > 0) {
            query = query.not("id", "in", `(${trader_assigned_originals.map(v => v.id).join(",")})`)
        }
    }

    const { data, error, count } = await query.range(page*pageSize, page*pageSize+pageSize-1);

    return { data, error, count };
}

async function getCategoryByName(client: SupabaseClient, category: string | string[]): Promise<{category: Category[] | null, error: PostgrestError | null}> {
    const filterNames = typeof category === "string" ? [category] : category;
    const { data, error } = await client
        .from("category")
        .select()
        .in("name", filterNames)

    if (error) {
        return {category: null, error: error};
    }

    return {category: data, error: null};
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

export async function PUT(request: Request) {
    const supabaseClient = createClient();

    const data = (await request.json()).formData as ImageResponseData;
    const { id, ...parsedData }: ImageDatabaseResponseData = putRequestDataToDatabaseData(data);

    if (!id) {
        return NextResponse.json({message: "ID muss angegeben werden"} ,{status: 400});
    }

    // Validate the parsed data
    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({message: errors.join("\n")},{status: 400});
    }

    // Perform the update in Supabase
    const { error } = await supabaseClient
        .from('image')
        .update(parsedData)
        .eq('id', id);

    if (error) {
        return NextResponse.json({message: "Fehler beim Aktualisieren des Bildes" + error.message} ,{status: 500});
    }

    return NextResponse.json({
        message: "Bild erfolgreich aktualisiert",
    });
}