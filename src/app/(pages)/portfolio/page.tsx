import { PortfolioList } from "@/src/app/components/portfolio-list";
import { TraderOnly } from "@/src/app/components/trader-only";
import { createClient } from "@/src/utils/supabase/server";
import { Add } from "@mui/icons-material";
import { Button, Divider, Typography } from "@mui/material";

export default async function PortfolioPage() {
    const supabaseClient = await createClient();

    const { data: { user } } = await supabaseClient
        .auth
        .getUser();

    return (
        <TraderOnly>
            <Typography variant={"h1"}>
                Themenmappen
            </Typography>

            <Button
                startIcon={<Add />}
                href="/portfolio/add"
                className={"top_action_buttons"}
            >
                Hinzufügen
            </Button>

            {user && (
                <PortfolioList
                    traderPortfolios={true}
                    userId={user?.id}
                />
            )}

            <Divider className={"divider_spacing"} />

            <Typography variant={"h1"}>
                Auswahlmappen
            </Typography>

            {user && (
                <PortfolioList
                    traderPortfolios={false}
                    userId={user?.id}
                />
            )}
        </TraderOnly>
    );
}
