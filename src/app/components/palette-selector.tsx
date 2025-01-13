import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface PaletteSelectorProps {
    required?: boolean;
    onChange?: (event: SelectChangeEvent<string>) => void;
}

export function PaletteSelector({
    required = false,
    onChange
}: PaletteSelectorProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [palettes, setPalettes] = useState<Palette[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const response = await fetch(`/api/palette`);

            const json = await response.json();

            setLoading(false);

            if (!response.ok) {
                enqueueSnackbar(json.message, { variant: "error" });
                setPalettes([]);
                return;
            }

            setPalettes(json["data"]);
        })();
    }, []);

    return loading ? <CircularProgress /> : (
        <FormControl fullWidth>
            <InputLabel id="palette-select" shrink>Palette</InputLabel>
            <Select
                label={"Palette"}
                id={"palette-select"}
                name={"palette-select"}
                fullWidth
                required={required}
                displayEmpty
                defaultValue={""}
                onChange={onChange}
            >
                <MenuItem value={""}>
                    <em>Keine Auswahl</em>
                </MenuItem>

                {palettes.map((palette) => (
                    <MenuItem
                        key={palette.id}
                        value={palette.id}
                    >{palette.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
