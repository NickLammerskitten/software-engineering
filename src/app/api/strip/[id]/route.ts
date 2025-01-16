import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

/*
    GET request at /api/strip with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const stripId = requestParams[5];
    if (!stripId) {
        return NextResponse.json({message: "Keine Leisten id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('strip')
        .select()
        .eq('id', stripId)
        .single();

    if (error) {
        return NextResponse.json({message: `Fehler beim Laden der Leiste, ${error.details}`}, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({message: "Keine Leiste gefunden"}, {
            status: 404,
        });
    }

    return NextResponse.json({
        data: data,
    });
}

/*
    DELETE request at /api/strip with parameter id
*/
export async function DELETE(request: NextRequest) {
    const requestParams = request.url.split("/");
    const stripId = requestParams[5];
    if (!stripId) {
        return NextResponse.json({message: "Keine Leisten id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { error } = await supabaseClient
        .from('strip')
        .delete()
        .eq('id', stripId)

    if (error) {
        return NextResponse.json({message: `Fehler beim Löschen der Leiste, ${error.details}`}, {
            status: 500,
        });
    }

    return NextResponse.json({
        success: true,
    });
}
