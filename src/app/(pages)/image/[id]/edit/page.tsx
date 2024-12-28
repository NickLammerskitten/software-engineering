import EditImageForm from "@/src/app/components/edit-image-form";
import { UserRole } from "@/src/app/models/user-role";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import { createClient } from "@/src/utils/supabase/server";
import { Typography } from "@mui/material";

export default async function EditImage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Bild bearbeiten
                    </Typography>

                    <EditImageForm />
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}
