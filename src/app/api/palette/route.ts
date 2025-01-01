import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

/*
    GET request at /api/palette
*/
export async function GET() {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('palette')
        .select()
        .order('id');

    if (!data) {
        return NextResponse.json({ message: "Keine Palette gefunden" }, {
            status: 404,
        });
    }

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Paletten" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
    });
}