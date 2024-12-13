import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/userRole";
import {Typography} from "@mui/material";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import AddCategoryForm from "@/src/app/components/add-category-form";

export default async function AddCategory() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Kategorie hinzufügen
                    </Typography>

                    <AddCategoryForm />
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}