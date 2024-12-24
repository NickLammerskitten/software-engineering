import { AddPortfolioForm } from "@/src/app/components/add-portfolio-form";
import { Typography } from "@mui/material";

export default async function AddPortfolio() {

    return (
        <div>
            <Typography variant={"h1"}>
                Themenmappe hinzufügen
            </Typography>

            <AddPortfolioForm />
        </div>
    )
}