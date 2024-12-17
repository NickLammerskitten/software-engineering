import { timestampToDate } from "@/src/app/utils/timestamp-to-date-formatter";
import { createClient } from "@/src/utils/supabase/server";
import { Typography } from "@mui/material";

export default async function Profile() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {user && (
                <>
                    <Typography variant={"h1"}>Profil</Typography>

                    <Typography variant={"body1"}>E-Mail: {user.email}</Typography>

                    <Typography variant={"body1"}>Rolle: {user.role === 'trader' ? "Händler" : "Kunde"}</Typography>

                    <Typography variant={"body1"}>Erstellt am: {timestampToDate(user.created_at)}</Typography>

                    <Typography variant={"body1"}>Aktualisiert am: {user.updated_at !== undefined
                            ? timestampToDate(user.updated_at)
                            : "Nie aktualisiert"}</Typography>

                    <Typography variant={"body1"}>ID: {user.id}</Typography>
                </>
            )}
        </div>
    )
}