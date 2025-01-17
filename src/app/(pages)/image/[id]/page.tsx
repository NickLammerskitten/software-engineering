import { DetailedImage } from "@/src/app/components/detailed-image";
import { UserRole } from "@/src/app/models/user-role";
import { createClient } from "@/src/utils/supabase/server";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { headers } from "next/headers";

export default async function DetailPage() {
    const supabaseClient = await createClient();

    const { data: { user } } = await supabaseClient
        .auth
        .getUser();

    const pathname = headers().get("x-current-path");
    const imageId = pathname?.split("/")[2];

    return (
        <>
            <Box>
                <Button
                    href="/gallery"
                    startIcon={<ArrowBackIosNew />}
                >Zurück</Button>
            </Box>
            {user && imageId ? (
                <DetailedImage
                    isTrader={user.role === UserRole.Trader}
                    imageId={imageId}
                    configurationId={null}
                />
            ) : (
                <Box>
                    <p>Kein Bild gefunden</p>
                </Box>
            )}
        </>
    );
}