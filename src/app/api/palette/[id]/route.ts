import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

/*
    GET request at /api/palette with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const paletteId = requestParams[5];
    if (!paletteId) {
        return NextResponse.json({message: "Keine Palette id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('palette')
        .select()
        .eq('id', paletteId)
        .single();

    if (!data) {
        return NextResponse.json({message: "Keine Palette gefunden"}, {
            status: 404,
        });
    }

    if (error) {
        return NextResponse.json({message: `Fehler beim Laden der Palette, ${error.details}`}, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
    });
}