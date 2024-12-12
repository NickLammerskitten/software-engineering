import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

/*
    GET request at /api/category with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const categoryId = requestParams[5];
    if (!categoryId) {
        return new NextResponse("Keine Categorie id angegeben.", {
            status: 404
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('category')
        .select()
        .eq('id', categoryId)
        .single();

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