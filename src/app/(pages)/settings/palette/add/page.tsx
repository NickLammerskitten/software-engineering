import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/user-role";
import {Button, Typography} from "@mui/material";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import AddItemForm from "@/src/app/components/add-item-form";
import { ArrowBack } from "@mui/icons-material";

export default async function AddPalette() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <Button href="/settings/palette" startIcon={<ArrowBack />} variant={"text"} style={{marginBottom: "5px"}}>Zurück</Button>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Palette hinzufügen
                    </Typography>

                    <AddItemForm apiPath={"/api/palette"} cancelPath={"/settings/palette"}/>
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}
