"use client"

import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export default function AddCategoryForm() {
    const { enqueueSnackbar } = useSnackbar();

    const [categoryNameValid, setCategoryNameValid] = useState<boolean>(true);
    const [categoryName, setCategoryName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

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
            id={"add-category-form"}
            action={(value) => handleSubmit(value)}
            ref={formRef}
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
                    helperText={categoryNameValid
                        ? ""
                        : "Der Name muss zwischen 3 und 30 Zeichen lang sein und darf Zeichen von a bis z, sowie Zahlen von 0 bis 9 enthalten."}
                    error={!categoryNameValid}
                />
            </FormControl>

            <Box className={"actions_container"}>
                <Button
                    variant={"text"}
                    type={"reset"}
                    href="/settings/category"
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
