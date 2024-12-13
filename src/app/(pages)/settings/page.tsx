import {Button, Typography} from "@mui/material";
import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrong-user-role";

export default async function Settings() {
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
                            href={"settings/category"}
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