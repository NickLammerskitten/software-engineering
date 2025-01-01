import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

/*
    GET request at /api/strip-color with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const stripColorId = requestParams[5];
    if (!stripColorId) {
        return NextResponse.json({message: "Keine Leistenfarbe id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('strip_color')
        .select()
        .eq('id', stripColorId)
        .single();

    if (!data) {
        return NextResponse.json({message: "Keine Leistenfarbe gefunden"}, {
            status: 404,
        });
    }

    if (error) {
        return NextResponse.json({message: `Fehler beim Laden der Leistenfarbe, ${error.details}`}, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
    });
}