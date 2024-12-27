import { createClient } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

/*
    GET request at /api/category with parameter id
*/
export async function GET(request: NextRequest) {
    const requestParams = request.url.split("/");
    const categoryId = requestParams[5];
    if (!categoryId) {
        return NextResponse.json({message: "Keine Categorie id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
        .from('category')
        .select()
        .eq('id', categoryId)
        .single();

    if (!data) {
        return NextResponse.json({message: "Keine Kategorie gefunden"}, {
            status: 404,
        });
    }

    if (error) {
        return NextResponse.json({message: `Fehler beim Laden der Kategorie, ${error.details}`}, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: data,
    });
}

/*
    DELETE request at /api/category with parameter id
*/
export async function DELETE(request: NextRequest) {
    const requestParams = request.url.split("/");
    const categoryId = requestParams[5];
    if (!categoryId) {
        return NextResponse.json({message: "Keine Categorie id angegeben."}, {
            status: 400
        })
    }

    const supabaseClient = createClient();
    const { error } = await supabaseClient
        .from('category')
        .delete()
        .eq('id', categoryId)

    if (error) {
        return NextResponse.json({message: `Fehler beim Löschen der Kategorie, ${error.details}`}, {
            status: 500,
        });
    }

    return NextResponse.json({
        success: true,
    });
}