/*
    GET request at /api/portfolio/my to get all portfolios of the current user
    Trader = Themenmappen
    Customer = Auswahlmappen
*/
import { PortfolioDatabaseResponseData, PortfolioResponseData } from "@/src/app/api/models/portfolio.model";
import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabaseClient = createClient();

    const requestParams = request.url.split("/");
    const portfolioId = requestParams[5];
    if (!portfolioId) {
        return NextResponse.json({ message: "Keine Portfolio id angegeben." }, {
            status: 400,
        })
    }

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
        return NextResponse.json({ message: "Nicht authentifiziert" }, {
            status: 401,
        });
    }

    const userId = userData.user.id as string;

    const { data, error } = await supabaseClient
        .from('portfolio')
        .select()
        .eq('id', portfolioId)
        .eq('owner_id', userId)
        .single();

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden des Portfolios" }, {
            status: 500,
        });
    }

    if (!data) {
        return NextResponse.json({ message: "Kein Portfolio gefunden" }, {
            status: 404,
        });
    }

    const parsedData = parseGetData(data as PortfolioDatabaseResponseData);

    return NextResponse.json({
        data: parsedData,
    });
}

const parseGetData = (data: PortfolioDatabaseResponseData): PortfolioResponseData => {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        owner_id: data.owner_id,
    }
}

export async function DELETE(request: NextRequest) {
    const supabaseClient = createClient();

    const requestParams = request.url.split("/");
    const portfolioId = requestParams[5];

    if (!portfolioId) {
        return NextResponse.json({ message: "Keine Portfolio id angegeben." }, {
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
        .from('portfolio')
        .delete()
        .eq('id', portfolioId)
        .eq('owner_id', userData.user.id);

    if (error) {
        return NextResponse.json({ message: "Fehler beim Löschen des Portfolios" }, {
            status: 500,
        });
    }

    return NextResponse.json({ message: "Portfolio erfolgreich gelöscht" });
}