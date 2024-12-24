import { PortfolioDatabaseResponseData, PortfolioResponseData } from "@/src/app/api/models/portfolio.model";
import { parseGetData } from "@/src/app/api/portfolio/data-parser";
import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

/*
    GET request at /api/portfolio/my to get all portfolios of the current user
    Trader = Themenmappen
    Customer = Auswahlmappen
*/
export async function GET() {
    const supabaseClient = createClient();

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
        .eq('owner_id', userId);

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