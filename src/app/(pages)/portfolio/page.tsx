import { TraderOnly } from "@/src/app/components/trader-only";
import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default async function Portfolio() {
    return (
        <div>
            <Typography variant={"h1"}>
                Themenmappen
            </Typography>

            <TraderOnly>
                <Button startIcon={<Add />}
                        href="/portfolio/add"
                        className={"top_action_buttons"}
                >
                    Themenmappe hinzufügen
                </Button>
            </TraderOnly>
        </div>
    );
}
