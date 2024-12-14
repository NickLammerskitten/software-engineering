import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/user-role";
import {Button, IconButton, Typography} from "@mui/material";
import WrongUserRole from "@/src/app/utils/wrongUserRole";
import AddCategoryForm from "@/src/app/components/add-category-form";
import { ArrowBack } from "@mui/icons-material";

export default async function AddCategory() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <Button href="/settings/category" startIcon={<ArrowBack />} variant={"text"} style={{marginBottom: "5px"}}>Zurück</Button>
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