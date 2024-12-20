"use client"

import { Portfolio } from "@/src/app/models/portfolio.model";
import { Alert, Box, Button, CircularProgress, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const successMessage: string = "Themenmappe erfolgreich bearbeitet!";
const errorMessage: string = "Fehler beim Bearbeiten der Themenmappe!";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export function EditPortfolioForm() {
    const pathname = usePathname();

    const [loading, setLoading] = useState<boolean>(true);
    const [portfolioId, setPortfolioId] = useState<string | null>(null);

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [portfolioNameValid, setPortfolioNameValid] = useState<boolean>(true)

    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setLoading(true);

        const pathnames = pathname.split('/') as string[];
        pathnames.pop();
        const portfolioId = pathnames.pop() as string;

        setPortfolioId(portfolioId);

        if (portfolioId == null) {
            setLoading(false);
            setPortfolio(null);
            return;
        }

        fetch(`/api/portfolio/${portfolioId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    throw new Error(`Error while fetching portfolio (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Portfolio }) => {
                setPortfolio(data.data);
                setLoading(false);
            });
    }, [pathname]);

    useEffect(() => {
        if (portfolio?.name == null || portfolio?.name == "") {
            setPortfolioNameValid(true);
            return;
        }

        const valid = nameRegEx.test(portfolio?.name);
        setPortfolioNameValid(valid);
    }, [portfolio]);

    const handleSubmit = async (formData: FormData) => {
        // TODO: Implement form data parsing
    }

    const handleChange = () => {
        setSuccess(undefined);
    }

    return (
        <>
            {loading ? (<CircularProgress />)
                : portfolio !== null ? (
                    <form
                        className={"form_container"}
                        id={"edit-portfolio-form"}
                        action={(value) => handleSubmit(value)}
                        onChange={handleChange}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Name *</FormLabel>
                            <TextField
                                id="name"
                                type="text"
                                name="name"
                                required
                                fullWidth
                                variant="outlined"
                                value={portfolio.name}
                                onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })}
                                helperText={portfolioNameValid
                                    ? ""
                                    : "Der Name muss zwischen 3 und 30 Zeichen lang sein und darf Zeichen" +
                                    " von a bis z, sowie Zahlen von 0 bis 9 enthalten."}
                                error={!portfolioNameValid}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <FormLabel htmlFor="title">Beschreibung</FormLabel>
                            <TextField
                                id="description"
                                type="text"
                                name="description"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                            />
                        </FormControl>

                        {success === true && <Alert severity="success">{successMessage}</Alert>}
                        {success === false && <Alert severity="error">{errorMessage}</Alert>}

                        <Box className={"actions_container"}>
                            <Button
                                variant={"text"}
                                type={"reset"}
                                href="/portfolio"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant={"contained"}
                                type={"submit"}
                            >
                                Speichern
                            </Button>
                        </Box>
                    </form>
                ) : (
                    <Typography variant={"body1"}>
                        Es ist ein unerwarteter Fehler aufgetreten.
                    </Typography>
                )}
        </>
    )
}