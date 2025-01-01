import { Portfolio } from "@/src/app/models/portfolio";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormLabel, InputAdornment,
    InputLabel,
    MenuItem, OutlinedInput,
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
    const [selectedPalette, setSelectedPalette] = useState<number | undefined>(undefined);

    const [loadingStripColors, setLoadingStripColors] = useState<boolean>(false);
    const [stripColors, setStripColors] = useState<StripColor[]>([]);
    const [selectedStripColor, setSelectedStripColor] = useState<number | undefined>(undefined);

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
            setSelectedPalette(json["data"][0].id);
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
            setSelectedStripColor(json["data"][0].id);
        }
    }

    const handleSubmit = async (formData: FormData) => {
        const data = {
            imageId: imageId,
            portfolioId: selectedPortfolio,
            paletteId: selectedPalette,
            stripColorId: selectedStripColor,
            passepartout: formData.get("passepartout"),
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
                    {loadingPalettes ? (<CircularProgress />) : palettes && palettes.length > 0 ? (
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
                                    setSelectedPalette(event.target.value as number);
                                })}
                            >
                                {palettes.map((palette) => (
                                    <MenuItem
                                        key={palette.id}
                                        value={palette.id}
                                    >{palette.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <Typography variant={"body1"}>
                            Noch keine Paletten vorhanden.
                        </Typography>
                    )}

                    {loadingStripColors ? (<CircularProgress />) : stripColors && stripColors.length > 0 ? (
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
                                    setSelectedStripColor(event.target.value as number);
                                })}
                            >
                                {stripColors.map((stripColor) => (
                                    <MenuItem
                                        key={stripColor.id}
                                        value={stripColor.id}
                                    >{stripColor.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <Typography variant={"body1"}>
                            Noch keine Paletten vorhanden.
                        </Typography>
                    )}

                    <FormControl fullWidth>
                        <FormLabel htmlFor="passepartout">Passepartout</FormLabel>
                        <OutlinedInput
                            id="name"
                            type="text"
                            name="passepartout"
                            required
                            fullWidth
                            endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                        />
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