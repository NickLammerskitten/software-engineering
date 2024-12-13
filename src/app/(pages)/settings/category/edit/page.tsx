"use server";

import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/user-role";
import {Typography} from "@mui/material";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import {EditCategoryForm} from "@/src/app/components/edit-category-form";

export default async function EditCategory() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Kategorie bearbeiten
                    </Typography>

                    <EditCategoryForm />
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}