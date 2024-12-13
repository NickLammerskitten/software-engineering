import {Button, Typography} from "@mui/material";
import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrongUserRole";
import {CategoryList} from "@/src/app/components/category-list";
import {Add} from "@mui/icons-material";

export default async function Categories() {
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

                    <Button startIcon={<Add/>}
                            href="/settings/category/add"
                            className={"top_action_buttons"}
                    >
                        Kategorie hinzufügen
                    </Button>

                    <CategoryList />
                </>
            ) : (
                <WrongUserRole/>
            )}
        </div>
    )
}