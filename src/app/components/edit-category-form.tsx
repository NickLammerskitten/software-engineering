"use client"

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Alert, Box, Button, CircularProgress, FormControl, FormLabel, TextField, Typography} from "@mui/material";

const successMessage: string = "Kategorie erfolgreich bearbeitet!";
const errorMessage: string = "Fehler beim Bearbeiten der Kategorie!";

export function EditCategoryForm() {
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null)

    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setLoading(true);

        const categoryId = searchParams.get('id') as number | null;
        setCategoryId(categoryId);

        if (categoryId == null) {
            setLoading(false);
            setCategoryName(null);
            return;
        }

        fetch(`/api/category/${categoryId}`)
            .then((res) => {
                if (!res.ok) {
                    setLoading(false);
                    throw new Error("Error fetching category");
                }

                return res.json();
            })
            .then((data: { data: Category }) => {
                setLoading(false);
                setCategoryName(data.data.name);
            });
    }, [searchParams]);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            id: categoryId,
            name: formData.get("name"),
        }

        await fetch('/api/category', {
            body: JSON.stringify({formData: data}),
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (!response.ok) {
                setSuccess(false);

                return;
            }

            const form = document.getElementById("edit-category-form") as HTMLFormElement;
            form.reset();

            setSuccess(true);
            return response.json();
        })
    }

    const handleChange = () => {
        setSuccess(undefined);
    }

    return (
        <>
            {loading ? (<CircularProgress/>)
                : categoryName !== null ? (
                    <form
                        className={"form_container"}
                        id={"edit-category-form"}
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
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
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
                ) : (
                    <Typography variant={"body1"}>
                        Es ist ein unerwarteter Fehler aufgetreten.
                    </Typography>
                )}
        </>
    )
}