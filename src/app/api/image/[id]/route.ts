import { databaseDataToResponseData } from "@/src/app/api/image/data-parser";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/*
    GET request at /api/category with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const imageId = requestParams[5];
    if (!imageId) {
        return NextResponse.json({ message: "Keine Bild id angegeben." }, {
            status: 400,
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('image')
        .select()
        .eq('id', imageId)
        .single();

    if (!data) {
        return NextResponse.json({ message: "Kein Bild gefunden" }, {
            status: 404,
        });
    }

    const parsedData = await databaseDataToResponseData(data);

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden des Bildes" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: parsedData,
    });
}