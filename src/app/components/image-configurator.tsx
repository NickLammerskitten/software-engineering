import { Portfolio } from "@/src/app/models/portfolio";
import {
    Box,
    Button, Checkbox,
    CircularProgress,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useState } from "react";

const customerPortfolioRoute: string = "/api/portfolio/my";
const traderPortfolioRoute: string = "/api/portfolio";

interface ImageConfiguratorProps {
    isTrader: boolean;
    imageId: string;
}

export function ImageConfigurator({ isTrader, imageId }: ImageConfiguratorProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [loadingPortfolios, setLoadingPortfolios] = useState<boolean>(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<number | undefined>(undefined);

    const [loadingPalettes, setLoadingPalettes] = useState<boolean>(false);
    const [palettes, setPalettes] = useState<Palette[]>([]);
    const [selectedPalette, setSelectedPalette] = useState("");

    const [loadingStripColors, setLoadingStripColors] = useState<boolean>(false);
    const [stripColors, setStripColors] = useState<StripColor[]>([]);
    const [selectedStripColor, setSelectedStripColor] = useState("");

    useEffect(() => {
        fetchPortfolios();
        fetchPalettes();
        fetchStripColors();
    }, [])

    const fetchPortfolios = async () => {
        setLoadingPortfolios(true);

        const response = await fetch(isTrader ? traderPortfolioRoute : customerPortfolioRoute);

        const json = await response.json();

        setLoadingPortfolios(false);

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            setPortfolios([]);
            return;
        }

        setPortfolios(json["data"]);
        if (json["data"].length > 0) {
            setSelectedPortfolio(json["data"][0].id);
        }
    }

    const fetchPalettes = async () => {
        setLoadingPalettes(true);

        const response = await fetch(`/api/palette`);

        const json = await response.json();

        setLoadingPalettes(false);

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            setPalettes([]);
            return;
        }

        setPalettes(json["data"]);
        if (json["data"].length > 0) {
            setSelectedPalette("-1");
        }
    }

    const fetchStripColors = async () => {
        setLoadingStripColors(true);

        const response = await fetch(`/api/strip-color`);

        const json = await response.json();

        setLoadingStripColors(false);

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            setStripColors([]);
            return;
        }

        setStripColors(json["data"]);
        if (json["data"].length > 0) {
            setSelectedStripColor("-1");
        }
    }

    const handleSubmit = async (formData: FormData) => {
        const data = {
            imageId: imageId,
            portfolioId: selectedPortfolio,
            paletteId: selectedPalette === "-1" ? null : selectedPalette,
            stripColorId: selectedStripColor === "-1" ? null : selectedStripColor,
            passepartout: formData.get("passepartout") === "on",
        }

        const response = await fetch(`/api/portfolio/configuration`, {
            method: "POST",
            body: JSON.stringify({
                formData: data,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        enqueueSnackbar(json.message, { variant: "success" });
    }

    return (
        <form
            className={"form_container"}
            id={"image-configurator-form"}
            action={handleSubmit}
        >
            {loadingPortfolios ? (<CircularProgress />) : portfolios && portfolios.length > 0 ? (
                <FormControl fullWidth>
                    <InputLabel id="portfolio-select">Mappe</InputLabel>
                    <Select
                        label={"Mappe"}
                        id={"portfolio-select"}
                        name={"portfolio-select"}
                        autoFocus
                        fullWidth
                        required
                        value={selectedPortfolio}
                        onChange={(event => {
                            setSelectedPortfolio(event.target.value as number);
                        })}
                    >
                        {portfolios.map((portfolio) => (
                            <MenuItem
                                key={portfolio.id}
                                value={portfolio.id}
                            >{portfolio.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Typography variant={"body1"}>Noch keine Mappen vorhanden. Erstelle deine erste Mappe, um eine Bild
                    Konfiguration hinzuzufügen!</Typography>
            )}

            {portfolios.length > 0 && (
                <>
                    {loadingPalettes ? (<CircularProgress />) : (
                        <FormControl fullWidth>
                            <InputLabel id="palette-select">Palette</InputLabel>
                            <Select
                                label={"Palette"}
                                id={"palette-select"}
                                name={"palette-select"}
                                autoFocus
                                fullWidth
                                required
                                value={selectedPalette}
                                onChange={(event => {
                                    setSelectedPalette(event.target.value);
                                })}
                            >
                                <MenuItem value="-1">
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
                    )}

                    {loadingStripColors ? (<CircularProgress />) : (
                        <FormControl fullWidth>
                            <InputLabel id="strip-color-select">Leistenfarbe</InputLabel>
                            <Select
                                label={"Palette"}
                                id={"strip-color-select"}
                                name={"strip-color-select"}
                                autoFocus
                                fullWidth
                                required
                                value={selectedStripColor}
                                onChange={(event => {
                                    setSelectedStripColor(event.target.value);
                                })}
                            >
                                <MenuItem value="-1">
                                    <em>Keine Auswahl</em>
                                </MenuItem>

                                {stripColors.map((stripColor) => (
                                    <MenuItem
                                        key={stripColor.id}
                                        value={stripColor.id}
                                    >{stripColor.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl fullWidth>
                        <Box>
                            <Checkbox
                                id="passepartout"
                                name="passepartout"
                            />
                            <FormLabel htmlFor="passepartout">Passepartout</FormLabel>
                        </Box>
                    </FormControl>
                </>
            )}

            <Box>
                {portfolios.length > 0 ? (
                    <Button
                        variant={"contained"}
                        type={"submit"}
                    >
                        Zu Mappe hinzufügen
                    </Button>
                ) : (
                    <Button
                        variant={"contained"}
                        href={"/portfolio/add"}
                    >
                        Neue Mappe erstellen
                    </Button>
                )}
            </Box>
        </form>
    )
}