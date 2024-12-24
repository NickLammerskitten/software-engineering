import {
    PortfolioData,
    PortfolioDatabaseData,
    PortfolioDatabaseResponseData,
    PortfolioPutData,
} from "@/src/app/api/models/portfolio.model";
import { parseGetData } from "@/src/app/api/portfolio/data-parser";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

/*
    GET request at /api/portfolio to get all portfolios
*/
export async function GET() {
    const supabaseClient = createClient();

    const { data, error } = await supabaseClient
        .from('portfolio')
        .select();

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Bilder" }, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({ message: "Keine Bilder gefunden" }, {
            status: 404,
        });
    }

    const parsedData = parseGetData(data as PortfolioDatabaseResponseData[]);

    return NextResponse.json({
        data: parsedData,
    });
}

export async function POST(request: NextRequest) {
    const supabaseClient = createClient()

    const { data: userData, error } = await supabaseClient.auth.getUser();

    if (error || !userData?.user) {
        return NextResponse.json({ message: "Nicht authentifiziert" }, {
            status: 401,
        });
    }

    const userId = userData.user.id as string;

    const portfolioData = (await request.json()).formData as PortfolioData;
    const parsedData = parsePostData(userId, portfolioData);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error: insertError } = await supabaseClient
        .from('portfolio')
        .insert([parsedData]);

    if (insertError) {
        return NextResponse.json({ message: "Fehler beim Hinzufügen des Portfolios" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Portfolio erfolgreich hinzugefügt",
    });
}

export async function PUT(request: NextRequest) {
    const supabaseClient = createClient()

    const data = (await request.json()).formData as PortfolioPutData;
    const parsedData = parsePutData(data);

    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({ message: errors.join("\n") }, {
            status: 400,
        });
    }

    const { error } = await supabaseClient
        .from('portfolio')
        .update([parsedData])
        .eq('id', parsedData.id);

    if (error) {
        return NextResponse.json({ message: "Fehler beim Bearbeiten des Portfolios" }, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Portfolio erfolgreich bearbeitet",
    });
}

const parsePostData = (userId: string, data: PortfolioData): PortfolioDatabaseData => {
    return {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        owner_id: userId,
    }
}

const parsePutData = (data: PortfolioPutData): PortfolioPutData => {
    return {
        id: data.id,
        name: data.name.trim(),
        description: data.description?.trim() || null,
    }
}

const validateData = (data: PortfolioDatabaseData | PortfolioPutData): { valid: boolean, errors: string[] } => {
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