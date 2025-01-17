import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabaseClient = createClient();

    const requestParams = request.url.split("/");
    const configurationId = requestParams[6];

    if (!configurationId) {
        return NextResponse.json({ message: "Keine Konfigurations id angegeben." }, {
            status: 400,
        });
    }

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
        return NextResponse.json({ message: "Nicht authentifiziert" }, {
            status: 401,
        });
    }

    const { data: configurationData, error: configurationError } = await supabaseClient
        .from('image_configuration')
        .select()
        .eq('id', configurationId)
        .single();

    if (configurationError) {
        return NextResponse.json({ message: "Fehler beim laden der Konfiguration" }, {
            status: 500,
        });
    }

    if (!configurationData) {
        return NextResponse.json({ message: "Konfiguration nicht gefunden" }, {
            status: 404,
        });
    }

    return NextResponse.json({
        data: {
            id: configurationData.id,
            imageId: configurationData.image_id,
            portfolioId: configurationData.portfolio_id,
            byTrader: configurationData.by_trader,
            paletteId: configurationData.palette_id,
            passepartout: configurationData.passepartout,
            stripId: configurationData.strip_id,
        },
    });
}

export async function DELETE(request: NextRequest) {
    const supabaseClient = createClient();

    const requestParams = request.url.split("/");
    const configurationId = requestParams[6];

    if (!configurationId) {
        return NextResponse.json({ message: "Keine Konfigurations id angegeben." }, {
            status: 400,
        });
    }

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
        return NextResponse.json({ message: "Nicht authentifiziert" }, {
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
        message: "Konfiguration erfolgreich entfernt",
    })
}