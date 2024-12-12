import { UserRole } from "@/src/app/models/userRole";
import { createClient } from "@/src/utils/supabase/server";
import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default async function Gallery() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <Typography variant={"h1"}>
                Galerie
            </Typography>

            {user?.role === UserRole.Trader && (
                <Button startIcon={<Add/>}
                    href="/gallery/add"
                >
                    Bild hinzufügen
                </Button>
            )}
        </div>
    );
}
