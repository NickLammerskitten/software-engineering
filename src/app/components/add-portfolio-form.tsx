"use client"

import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export function AddPortfolioForm() {
    const { enqueueSnackbar } = useSnackbar();

    const [portfolioNameValid, setPortfolioNameValid] = useState<boolean>(true);
    const [portfolioName, setPortfolioName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (portfolioName == null || portfolioName == "") {
            setPortfolioNameValid(true);
            return;
        }

        const valid = nameRegEx.test(portfolioName);
        setPortfolioNameValid(valid);
    }, [portfolioName]);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
        }

        await fetch('/api/portfolio', {
            body: JSON.stringify({ formData: data }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            if (!response.ok) {
                enqueueSnackbar(json.message, { variant: "error" });
                return;
            }

            formRef.current?.reset();

            enqueueSnackbar(json.message, { variant: "success" });
        })
    }

    return (
        <form
            className={"form_container"}
            id={"add-porfolio-form"}
            action={(value) => handleSubmit(value)}
            ref={formRef}
        >
            <FormControl fullWidth>
                <FormLabel htmlFor="name">Name *</FormLabel>
                <TextField
                    id="name"
                    type="text"
                    name="name"
                    required
                    fullWidth
                    variant="outlined"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    helperText={portfolioNameValid ? "" : "Der Name muss zwischen 3 und 30 Zeichen lang sein und darf" +
                        " Zeichen von a bis z, sowie Zahlen von 0 bis 9 enthalten."}
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
    )
}