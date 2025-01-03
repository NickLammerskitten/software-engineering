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

interface StripSelectorProps {
    required?: boolean;
    onChange?: (event: SelectChangeEvent<string>) => void;
}

export function StripSelector({
    required = false,
    onChange
}: StripSelectorProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [strips, setStrips] = useState<Strip[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const response = await fetch(`/api/strip`);

            const json = await response.json();

            setLoading(false);

            if (!response.ok) {
                enqueueSnackbar(json.message, { variant: "error" });
                setStrips([]);
                return;
            }

            setStrips(json["data"]);
        })();
    }, []);

    return loading ? <CircularProgress /> : (
        <FormControl fullWidth>
            <InputLabel id="strip-select" shrink>Strip</InputLabel>
            <Select
                label={"Strip"}
                id={"strip-select"}
                name={"strip-select"}
                fullWidth
                required={required}
                displayEmpty
                defaultValue={""}
                onChange={onChange}
            >
                <MenuItem value={""}>
                    <em>Keine Auswahl</em>
                </MenuItem>

                {strips.map((strip) => (
                    <MenuItem
                        key={strip.id}
                        value={strip.id}
                    >{strip.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
