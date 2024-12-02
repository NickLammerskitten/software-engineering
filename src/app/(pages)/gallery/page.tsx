import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function Gallery() {
    return (
        <div>
            Discover page

            <Button startIcon={<Add/>}
                href="/gallery/add"
            >
                Bild hinzufügen
            </Button>
        </div>
    );
}
