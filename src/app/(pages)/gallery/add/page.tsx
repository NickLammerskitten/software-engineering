"use server";

import AddImageForm from "@/src/app/components/add-image-form";
import { UserRole } from "@/src/app/models/user-role";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import { createClient } from "@/src/utils/supabase/server";
import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default async function AddImage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <Button href="/gallery" startIcon={<ArrowBack />} variant={"text"} style={{marginBottom: "5px"}}>Zurück</Button>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Bild hinzufügen
                    </Typography>

                    <AddImageForm />
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}
