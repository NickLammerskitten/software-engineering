import {createClient} from "@/src/utils/supabase/server";
import {Typography} from "@mui/material";
import {UserRole} from "@/src/app/models/user-role";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import AddUserForm from "@/src/app/components/add-user-form";

export default async function Users() {
    const supabase = await createClient();
    const { data: { user} } = await supabase.auth.getUser();

    return (
        <div>
            <Typography variant={"h1"}>Benutzer hinzufügen</Typography>

            {user?.role === UserRole.Trader ? (
                <AddUserForm/>
            ) : (
                <WrongUserRole/>
            )}
        </div>
    );
}