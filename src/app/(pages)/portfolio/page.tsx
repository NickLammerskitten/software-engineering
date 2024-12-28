import { PortfolioList } from "@/src/app/components/portfolio-list";
import { TraderOnly } from "@/src/app/components/trader-only";
import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default async function PortfolioPage() {
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

            <PortfolioList />
        </TraderOnly>
    );
}
