import {Button, Typography} from "@mui/material";
import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrongUserRole";

export default async function SettingsPage() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    return (
        <>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Einstellungen
                    </Typography>

                    <Button variant={"outlined"}
                            href={"settings/categories"}
                    >
                        Kategorien
                    </Button>
                </>
            ) : (
                <WrongUserRole/>
            )}
        </>
    )
}