import {Button, Typography} from "@mui/material";
import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/user-role";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import {ItemList} from "@/src/app/components/item-list";
import {Add} from "@mui/icons-material";

export default async function Categories() {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Paletten verwalten
                    </Typography>

                    <Button startIcon={<Add/>}
                            href="/settings/palette/add"
                            className={"top_action_buttons"}
                    >
                        Palette hinzufügen
                    </Button>

                    <ItemList apiPath={"/api/palette"} editPath={"palette/edit"} />
                </>
            ) : (
                <WrongUserRole/>
            )}
        </div>
    )
}
