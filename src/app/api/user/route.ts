import { createAdminClient, IsTrader } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

/*
    GET request at /api/user without parameters to get all users
*/
export async function GET() {
    const supabaseClient = createAdminClient();

    const isTrader = await IsTrader(supabaseClient);
    if (!isTrader) {
        return NextResponse.json({ message: "Nicht autorisiert" }, {
            status: 401,
        });
    }

    const { data: { users }, error } = await supabaseClient
        .auth
        .admin
        .listUsers();

    if (error) {
        return NextResponse.json({ message: "Fehler beim Laden der Nutzer " + error }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: users,
    })
}