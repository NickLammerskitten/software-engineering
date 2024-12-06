import { ImagesList } from "@/src/app/components/images-list";
import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default function Gallery() {

    return (
        <div>
            <Typography variant={"h1"}>
                Discover page
            </Typography>

            <Button startIcon={<Add/>}
                href="/gallery/add"
            >
                Bild hinzufügen
            </Button>

            <ImagesList />
        </div>
    );
}
