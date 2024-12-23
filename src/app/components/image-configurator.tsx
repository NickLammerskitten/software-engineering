import { Portfolio } from "@/src/app/models/portfolio.model";
import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";

const successMessage: string = "Bild erfolgreich hinzugefügt!";
const errorMessage: string = "Fehler beim Hinzufügen des Bildes!";

export function ImageConfigurator({ imageId }: { imageId: string }) {
    const [loadingPortfolios, setLoadingPortfolios] = useState<boolean>(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<number | undefined>(undefined);

    const [success, setSuccess] = useState<boolean | undefined>()

    useEffect(() => {
        fetchPortfolios();
    }, [])

    const fetchPortfolios = async () => {
        setLoadingPortfolios(true);

        const response = await fetch(`/api/portfolio/my`);

        const json = await response.json();

        setLoadingPortfolios(false);

        if (!response.ok) {
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
        }

        const response = await fetch(`/api/portfolio/configuration`, {
            method: "POST",
            body: JSON.stringify({
                formData: data,
            }),
        });

        if (!response.ok) {
            setSuccess(false);
            return;
        }

        setSuccess(true);
    }

    const handleChange = () => {
        setSuccess(undefined);
    }

    return (
        <form
            className={"form_container"}
            id={"image-configurator-form"}
            action={(value) => handleSubmit(value)}
            onChange={handleChange}
        >
            {loadingPortfolios && (<CircularProgress />)}

            {!loadingPortfolios && portfolios && (
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
                            setSuccess(undefined);
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

            {success === true && <Alert severity="success">{successMessage}</Alert>}
            {success === false && <Alert severity="error">{errorMessage}</Alert>}

            <Box className={"actions_container"}>
                <Button
                    variant={"contained"}
                    type={"submit"}
                >
                    Zu Mappe hinzufügen
                </Button>
            </Box>
        </form>
    )
}