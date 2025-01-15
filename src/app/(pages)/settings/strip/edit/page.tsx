"use server";

import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/user-role";
import {Button, Typography} from "@mui/material";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import {EditItemForm} from "@/src/app/components/edit-item-form";
import { ArrowBack } from "@mui/icons-material";

export default async function EditStrip() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <Button href="/settings/strip" startIcon={<ArrowBack />} variant={"text"} style={{marginBottom: "5px"}}>Zurück</Button>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Leiste bearbeiten
                    </Typography>

                    <EditItemForm apiPath={"/api/strip"} cancelPath={"/settings/strip"}/>
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}
