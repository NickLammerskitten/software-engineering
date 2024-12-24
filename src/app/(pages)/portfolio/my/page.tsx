import { DetailedPortfolio } from "@/src/app/components/detailed-portfolio";
import { Typography } from "@mui/material";

export default async function MyPortfolioPage() {

    return (
        <div>
            <Typography variant="h1">
                Meine Auswahlmappe
            </Typography>

            <DetailedPortfolio />
        </div>
    )
}