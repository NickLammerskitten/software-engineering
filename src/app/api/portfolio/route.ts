import {
    PortfolioData,
    PortfolioDatabaseData,
} from "@/src/app/api/models/portfolio.model";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const {data: userData, error} = await supabaseClient.auth.getUser();

    if (error || !userData?.user) {
        return new NextResponse("Nicht authentifiziert", {
            status: 401,
        });
    }

    const userId = userData.user.id as string;

    const portfolioData = (await request.json()).formData as PortfolioData;
    const parsedData = parsePostData(userId, portfolioData);

    const {valid, errors} = validateData(parsedData);
    if (!valid) {
        return new NextResponse(errors.join("\n"), {
            status: 400,
        });
    }

    const { error: insertError } = await supabaseClient
        .from('portfolio')
        .insert([parsedData]);

    if (insertError) {
        return NextResponse.json({message: "Fehler beim Hinzufügen des Portfolios"}, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Portfolio erfolgreich hinzugefügt",
    });
}

const parsePostData = (userId: string, data: PortfolioData): PortfolioDatabaseData => {
    return {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        owner_id: userId,
    }
}

const validateData = (data: PortfolioDatabaseData): {valid: boolean, errors: string[]} => {
    const errors: string[] = [];

    if (data.name === undefined || !nameRegEx.test(data.name)) {
        errors.push("Name entspricht nicht den Anforderungen.");
    }

    if (typeof data.description !== "string" && data.description !== null) {
        errors.push("Beschreibung muss leer oder ein Text sein.");
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}