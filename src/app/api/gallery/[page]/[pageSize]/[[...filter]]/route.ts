import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

interface getImagesRequest {
    page: number;
    pageSize: number;
    filter: string[] | undefined;
}

export async function GET(request: Request) {
    const requestParams = request.url.split("/");

    const page = parseInt(requestParams[5]);
    const pageSize = parseInt(requestParams[6]);
    // TODO: Implement filter
    const filter = undefined;

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

const validateGetImagesRequest = (data: getImagesRequest): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (typeof data.page !== 'number' || data.page < 0) {
        errors.push("Seite muss eine positive Zahl sein.");
    }
    if (typeof data.pageSize !== 'number' || data.pageSize <= 0) {
        errors.push("Seitengröße muss eine positive Zahl sein.");
    }

    return { valid: errors.length === 0, errors };
}