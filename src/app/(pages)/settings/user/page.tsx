import { UserList } from "@/src/app/components/user-list";
import { UserRole } from "@/src/app/models/user-role";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import { createClient } from "@/src/utils/supabase/server";
import { Typography } from "@mui/material";

export default async function User() {
    const supabase = await createClient();

    const { data: { user} } = await supabase.auth.getUser();

    return (
        <div>
            <Typography variant={"h1"}>Benutzer</Typography>

            {user?.role === UserRole.Trader ? (
                <UserList />
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}