import { Portfolio } from "@/src/app/models/portfolio";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useState } from "react";
import { PaletteSelector } from "./palette-selector";
import { StripSelector } from "./strip-selector";

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

    useEffect(() => {
        fetchPortfolios();
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

    const handleSubmit = async (formData: FormData) => {
        const data = {
            imageId: imageId,
            portfolioId: selectedPortfolio,
            paletteId: !formData.get("palette-select") ? null : formData.get("palette-select"),
            stripId: !formData.get("strip-select") ? null : formData.get("strip-select"),
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
                <>
                    {isTrader && (
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
                    )}
                </>
            ) : (
                <>
                    {isTrader ? (
                        <Typography variant={"body1"}>
                            Noch keine Mappen vorhanden. Erstelle deine erste Mappe, um eine Bild Konfiguration
                            hinzuzufügen!
                        </Typography>
                    ) : (
                        <Typography variant={"body1"}>
                            Du hast keine Auswahlmappe. Bitte kontaktiere einen Händler, um eine Bild Konfiguration
                            hinzuzufügen!
                        </Typography>
                    )}
                </>
            )}

            {portfolios.length > 0 && (
                <>
                    <PaletteSelector />
                    <StripSelector />
                    <FormControlLabel
                        name={"passepartout"}
                        control={<Checkbox />}
                        label="Passepartout"
                    />
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
                ) : isTrader && (
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