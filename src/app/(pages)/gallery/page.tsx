import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { Gallery } from "../../components/gallery";
import { TraderOnly } from "../../components/trader-only";

export default async function GalleryPage() {
    return (
        <div>
            <Typography variant={"h1"}>
                Galerie
            </Typography>

            <TraderOnly>
                <Button startIcon={<Add />}
                    href="/image/add"
                    className={"top_action_buttons"}
                >
                    Bild hinzufügen
                </Button>
            </TraderOnly>

            <Gallery />
        </div>
    );
}
