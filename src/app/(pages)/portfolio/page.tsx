import { PortfolioList } from "@/src/app/components/portfolio-list";
import { TraderOnly } from "@/src/app/components/trader-only";
import { UserRole } from "@/src/app/models/user-role";
import { createClient } from "@/src/utils/supabase/server";
import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default async function Portfolio() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {user?.role === UserRole.Trader ? (
                <Typography variant={"h1"}>
                    Themenmappen
                </Typography>
            ) : (
                <Typography variant={"h1"}>
                    Auswahlmappen
                </Typography>
            )}

            <TraderOnly>
                <Button startIcon={<Add />}
                        href="/portfolio/add"
                        className={"top_action_buttons"}
                >
                    Hinzufügen
                </Button>
            </TraderOnly>

            <PortfolioList />
        </div>
    );
}
