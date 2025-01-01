import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

/*
    GET request at /api/strip-color
*/
export async function GET() {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('strip_color')
        .select()
        .order('id');

    if (!data) {
        return NextResponse.json({ message: "Keine Leistenfarbe gefunden" }, {
            status: 404,
        });
    }

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Leistenfarben" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
    });
}