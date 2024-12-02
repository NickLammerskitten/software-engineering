import { UserRole } from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrongUserRole";
import { createClient } from "@/src/utils/supabase/server";
import { Typography } from "@mui/material";

export default async function Portfolio() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Customer ? (
                <>
                    <Typography variant={"h1"}>
                        Meine Mappe
                    </Typography>
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}
