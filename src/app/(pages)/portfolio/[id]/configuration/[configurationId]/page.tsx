import { DetailedImage } from "@/src/app/components/detailed-image";
import { UserRole } from "@/src/app/models/user-role";
import { createClient } from "@/src/utils/supabase/server";
import { Box, Typography } from "@mui/material";
import { headers } from "next/headers";

export default async function EditConfigurationPage() {
    const supabaseClient = await createClient();

    const { data: { user } } = await supabaseClient
        .auth
        .getUser();

    const pathname = headers().get("x-current-path");
    const configurationId = pathname?.split("/")[4];

    return (
        <>
            <Typography variant={"h1"}>
                Bildkonfiguration bearbeiten
            </Typography>

            {user && configurationId ? (
                <DetailedImage
                    isTrader={user.role === UserRole.Trader}
                    imageId={null}
                    configurationId={configurationId}
                />
            ) : (
                <Box>
                    <p>Keine Bildkonfiguration gefunden</p>
                </Box>
            )}
        </>
    );
}