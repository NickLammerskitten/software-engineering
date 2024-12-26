import { EditPortfolioForm } from "@/src/app/components/edit-portfolio-form";
import { Typography } from "@mui/material";

export default async function EditPortfolioPage() {

    return (
        <div>
            <Typography variant={"h1"}>
                Themenmappe bearbeiten
            </Typography>

            <EditPortfolioForm />
        </div>
    )
}