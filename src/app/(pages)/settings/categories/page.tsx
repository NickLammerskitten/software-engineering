import {Typography} from "@mui/material";
import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrongUserRole";
import {CategoryList} from "@/src/app/components/category-list";

export default async function CategoriesPage() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Kategorien verwalten
                    </Typography>

                    <CategoryList />
                </>
            ) : (
                <WrongUserRole/>
            )}
        </div>
    )
}