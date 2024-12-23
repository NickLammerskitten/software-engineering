import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const supabaseClient = createClient();

    const requestParams = request.url.split("/");
    const configurationId = requestParams[6];

    if (!configurationId) {
        return new NextResponse("Keine Konfigurations id angegeben.", {
            status: 400,
        });
    }

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
        return new NextResponse("Nicht authentifiziert", {
            status: 401,
        });
    }

    const { error } = await supabaseClient
        .from('image_configuration')
        .delete()
        .eq('id', configurationId);

    if (error) {
        return NextResponse.json({ message: "Fehler beim entfernen der Konfiguration" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Konfiguration erfolgreich entfernt"
    })
}