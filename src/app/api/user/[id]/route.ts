import {NextRequest, NextResponse} from "next/server";
import {createAdminClient, IsTrader} from "@/src/utils/supabase/server";


export async function DELETE(request: NextRequest) {
    const requestParams = request.url.split("/");
    const UserId = requestParams[5];

    const supabaseClient = createAdminClient();
    const isTrader = await IsTrader(supabaseClient);
    if (!isTrader) {
        return NextResponse.json({ message: "Nicht autorisiert" }, {
            status: 401,
        });
    }

    const { data: { user }, error } = await supabaseClient
        .auth
        .admin
        .deleteUser(UserId);

    if (error) {
        return NextResponse.json({ message: "Fehler beim Löschen des Nutzers " + error.message }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: user,
        message: "Nutzer erfolgreich gelöscht"
    })
}