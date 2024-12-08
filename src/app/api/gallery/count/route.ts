import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabaseClient = createClient();
    const { count, error } = await supabaseClient
        .from('image')
        .select("*", { count: 'exact', head: true })

    if (error) {
        return new NextResponse("Fehler beim Laden der Bilder", {
            status: 500,
        });
    }

    return NextResponse.json({
        data: count,
    });
}