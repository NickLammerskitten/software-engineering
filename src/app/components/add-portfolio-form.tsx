"use client"

import { Alert, Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const successMessage: string = "Themenmappe erfolgreich hinzugefügt!";
const errorMessage: string = "Fehler beim Hinzufügen der Themenmappe!";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export function AddPortfolioForm() {

    const [portfolioNameValid, setPortfolioNameValid] = useState<boolean>(true);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
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
        }).then((response) => {
            if (!response.ok) {
                setSuccess(false);
                return;
            }

            formRef.current?.reset();

            setSuccess(true);
            return response.json();
        })
    }

    const handleChange = () => {
        setSuccess(undefined);
    }

    return (
        <form
            className={"form_container"}
            id={"add-porfolio-form"}
            action={(value) => handleSubmit(value)}
            onChange={handleChange}
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
    )
}