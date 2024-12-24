import { PortfolioDatabaseResponseData } from "@/src/app/api/models/portfolio.model";
import { parseGetData } from "@/src/app/api/portfolio/data-parser";
import { createClient } from "@/src/utils/supabase/server";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/*
    GET request at /api/portfolio/my to get all portfolios of the current user
    Trader = Themenmappen (multiple possible)
    Customer = Auswahlmappe (only one possible)
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

    const { data, error } = await fetchPortfolios(userId, supabaseClient)

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

    const parsedData = (data as PortfolioDatabaseResponseData[]).map(parseGetData)

    return NextResponse.json({
        data: parsedData,
    });
}

const fetchPortfolios = async (userId: string, supabaseClient: SupabaseClient): Promise<{
    data: PortfolioDatabaseResponseData[],
    error: PostgrestError | null
}> => {
    const { data, error } = await supabaseClient
        .from('portfolio')
        .select()
        .eq('owner_id', userId)

    const typedData: PortfolioDatabaseResponseData[] = data as PortfolioDatabaseResponseData[];

    return { data: typedData, error: error };
}