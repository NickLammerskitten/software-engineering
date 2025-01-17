import { ImageConfiguration, Portfolio } from "@/src/app/models/portfolio";
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
    configurationId: string | null;
    imageId: string;
    imageConfiguration: ImageConfiguration | null;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handleCreateConfiguration = async (data) => {
    return await fetch(`/api/portfolio/configuration`, {
        method: "POST",
        body: JSON.stringify({
            formData: data,
        }),
    });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handleSaveConfiguration = async (data) => {
    return await fetch(`/api/portfolio/configuration`, {
        method: "PUT",
        body: JSON.stringify({
            formData: data,
        }),
    });
}

export function ImageConfigurator({ isTrader, configurationId, imageId, imageConfiguration }: ImageConfiguratorProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [loadingPortfolios, setLoadingPortfolios] = useState<boolean>(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<string | undefined>(undefined);

    const [paletteId, setPaletteId] = useState<string | undefined>(undefined);
    const [stripId, setStripId] = useState<string | undefined>(undefined);
    const [passepartout, setPassepartout] = useState<boolean>(false);

    useEffect(() => {
        fetchPortfolios();
    }, [])

    useEffect(() => {
        if (imageConfiguration) {
            setSelectedPortfolio(imageConfiguration.portfolioId ?? undefined);
            setPaletteId(imageConfiguration.paletteId ?? undefined);
            setStripId(imageConfiguration.stripId ?? undefined);
            setPassepartout(imageConfiguration.passepartout);
        }
    }, [imageConfiguration]);

    const handleCheckPassepartout = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassepartout(event.target.checked);
    };

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
        if (json["data"].length > 0 && !selectedPortfolio) {
            setSelectedPortfolio(json["data"][0].id);
        }
    }

    const handleSubmit = async (formData: FormData) => {
        let portfolioId = selectedPortfolio;
        if (imageConfiguration && imageConfiguration.portfolioId) {
            portfolioId = imageConfiguration.portfolioId;
        }

        const data = {
            imageId: imageId,
            portfolioId: portfolioId,
            paletteId: !formData.get("palette-select") ? null : formData.get("palette-select"),
            stripId: !formData.get("strip-select") ? null : formData.get("strip-select"),
            passepartout: formData.get("passepartout") === "on",
        }

        let response: Response;
        if (configurationId) {
            const putData = {
                ...data,
                id: configurationId,
            }
            response = await handleSaveConfiguration(putData);
        } else {
            response = await handleCreateConfiguration(data);
        }

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
                    {isTrader && !configurationId && (
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
                                    setSelectedPortfolio(event.target.value as string);
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
                    <PaletteSelector
                        onChange={(e) => setPaletteId(e.target.value)}
                        selectedPalette={paletteId}
                    />
                    <StripSelector
                        onChange={(e) => setStripId(e.target.value)}
                        selectedStrip={stripId}
                    />
                    <FormControlLabel
                        name={"passepartout"}
                        control={<Checkbox
                            checked={passepartout}
                            onChange={handleCheckPassepartout}
                        />}
                        label="Passepartout"
                    />
                </>
            )}

            <>
                {configurationId ? (
                    <Box>
                        <Button
                            variant={"contained"}
                            type={"submit"}
                        >
                            Speichern
                        </Button>
                    </Box>
                ) : (
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
                )}
            </>
        </form>
    )
}