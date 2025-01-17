import { createAdminClient, IsTrader } from "@/src/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";
import {User} from "@supabase/auth-js";

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
        return NextResponse.json({ message: "Fehler beim Laden der Nutzer " + error.message }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: users,
    })
}

/*
    POST request at /api/user without parameters to create a new user
 */
export async function POST(request: NextRequest) {
    const supabaseClient = createAdminClient();
    const data = (await request.json()).formData as User;
    const isTrader = await IsTrader(supabaseClient);
    if (!isTrader) {
        return NextResponse.json({ message: "Nicht autorisiert" }, {
            status: 401,
        });
    }

    const { data: { user }, error } = await supabaseClient
        .auth
        .admin
        .createUser(data);

    if (error) {
        return NextResponse.json({ message: "Fehler beim Erstellen des Nutzers " + error.message }, {
            status: 500,
        });
    }

    return NextResponse.json({
        data: user,
        message: "Nutzer erfolgreich angelegt"
    })
}

