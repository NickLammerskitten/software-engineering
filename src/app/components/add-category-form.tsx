"use client"

import {useEffect, useState} from "react";
import {Alert, Box, Button, FormControl, FormLabel, TextField} from "@mui/material";

const successMessage: string = "Kategorie erfolgreich hinzugefügt!";
const errorMessage: string = "Fehler beim Hinzufügen der Kategorie!";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export default function AddCategoryForm() {
    const [categoryNameValid, setCategoryNameValid] = useState<boolean>(true)
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [categoryName, setCategoryName] = useState<string | null>(null)

    useEffect(() => {
        if (categoryName == null || categoryName == "") {
            setCategoryNameValid(true);
            return;
        }

        const valid = nameRegEx.test(categoryName);
        setCategoryNameValid(valid);
    }, [categoryName]);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            name: formData.get("name"),
        }

        await fetch('/api/category', {
            body: JSON.stringify({formData: data}),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (!response.ok) {
                setSuccess(false);

                return;
            }

            const form = document.getElementById("add-category-form") as HTMLFormElement;
            form.reset();

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
            id={"add-category-form"}
            action={(value) => handleSubmit(value)}
            onChange={handleChange}
        >
            <FormControl fullWidth>
                <FormLabel htmlFor="title">Name *</FormLabel>
                <TextField
                    id="name"
                    type="text"
                    name="name"
                    required
                    fullWidth
                    variant="outlined"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    helperText={categoryNameValid ? "" : "Der Name muss zwischen 3 und 30 Zeichen lang sein und darf Zeichen von a bis z, sowie Zahlen von 0 bis 9 enthalten."}
                    error={!categoryNameValid}
                />
            </FormControl>

            {success === true && <Alert severity="success">{successMessage}</Alert>}
            {success === false && <Alert severity="error">{errorMessage}</Alert>}

            <Box className={"actions_container"}>
                <Button
                    variant={"text"}
                    type={"reset"}
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
