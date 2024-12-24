import { ImageConfigurationData, ImageConfigurationDatabaseData } from "@/src/app/api/models/image-configuration.model";
import { UserRole } from "@/src/app/models/user-role";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user == null) {
        return NextResponse.json({ message: "Benutzer nicht gefunden." }, {
            status: 404,
        });
    }

    const isTrader = user.role === UserRole.Trader;
    const data = (await request.json()).formData as ImageConfigurationData;
    const parsedData = postRequestDataToDatabaseData(data, isTrader);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('image_configuration')
        .insert([parsedData]);
    if (error) {
        return NextResponse.json({ message: "Fehler beim Hinzufügen der Konfiguration" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Konfiguration erfolgreich hinzugefügt",
    });
}

const postRequestDataToDatabaseData = (
    data: ImageConfigurationData,
    isTrader: boolean,
): ImageConfigurationDatabaseData => {
    return {
        image_id: data.imageId,
        portfolio_id: data.portfolioId,
        by_trader: isTrader,
    }
}

const validateData = (data: ImageConfigurationDatabaseData): { valid: boolean, errors: string[] } => {
    const errors: string[] = [];

    if (typeof data.image_id !== 'string' || data.image_id.trim() === "") {
        errors.push("Bildauswahl fehlerhaft.");
    }
    if (typeof data.portfolio_id !== 'string' || data.portfolio_id.trim() === "") {
        errors.push("Portfolioauswahl fehlerhaft.");
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}