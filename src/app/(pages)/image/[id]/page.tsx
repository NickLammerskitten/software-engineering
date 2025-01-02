import { DetailedImage } from "@/src/app/components/detailed-image";
import { UserRole } from "@/src/app/models/user-role";
import { createClient } from "@/src/utils/supabase/server";
import {Box, Button} from "@mui/material";
import {ArrowBackIosNew} from "@mui/icons-material";

export default async function DetailPage() {
    const supabaseClient = await createClient();

    const { data: { user } } = await supabaseClient
        .auth
        .getUser();

    return (
        <>
            <Box>
                <Button href="/gallery" startIcon={<ArrowBackIosNew/>}>Zurück</Button>
            </Box>
            {user && (
                <DetailedImage isTrader={user.role === UserRole.Trader} />
            )}
        </>
    );
}