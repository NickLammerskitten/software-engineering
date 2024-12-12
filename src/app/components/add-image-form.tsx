"use client"

import { Alert, Box, Button, FormControl, FormLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import * as React from "react";
import { useState } from "react";

const successMessage: string = "Bild erfolgreich hinzugefügt!";
const errorMessage: string = "Fehler beim Hinzufügen des Bildes!";

export default function AddImageForm() {
    // TODO: Fetch categories from database
    const [categories] = useState([
        { value: 1, label: "Original" },
        { value: 2, label: "Replika" },
    ]);

    const [selectedCategory, setSelectedCategory] = useState(categories[0].value);

    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            categoryId: formData.get("category-select"),
            title: formData.get("title"),
            description: formData.get("description"),
            imageHeight: formData.get("imageHeight"),
            imageWidth: formData.get("imageWidth"),
            paperHeight: formData.get("paperHeight"),
            paperWidth: formData.get("paperWidth"),
            price: formData.get("price"),
            annotations: formData.get("annotations"),
        }

        await fetch(`/api/gallery`, {
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

            const form = document.getElementById("add-image-form") as HTMLFormElement;
            form.reset();

            setSuccess(true);

            return response.json();
        });
    }

    const handleChange = () => {
        setSuccess(undefined);
    }

    return (
        <form
            className={"form_container"}
            id={"add-image-form"}
            action={(value) => handleSubmit(value)}
            onChange={handleChange}
        >
            <FormControl fullWidth
            >
                <InputLabel id="category-select">Kategorie *</InputLabel>
                <Select
                    label={"Kategorie"}
                    id={"category-select"}
                    name={"category-select"}
                    autoFocus
                    fullWidth
                    required
                    value={selectedCategory}
                    onChange={(event => setSelectedCategory(event.target.value as number))}
                >
                    {categories.map((category) => (
                        <MenuItem
                            key={category.value}
                            value={category.value}
                        >{category.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="title">Titel *</FormLabel>
                <TextField
                    id="title"
                    type="text"
                    name="title"
                    required
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="description">Beschreibung</FormLabel>
                <TextField
                    id="description"
                    type="text"
                    name="description"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="imageHeight">Bildhöhe</FormLabel>
                <OutlinedInput 
                    id="imageHeight"
                    type="number"
                    name="imageHeight"
                    inputProps={{ step: "any" }}
                    fullWidth
                    endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="imageWidth">Bildbreite</FormLabel>
                <OutlinedInput 
                    id="imageWidth"
                    type="number"
                    name="imageWidth"
                    inputProps={{ step: "any" }}
                    fullWidth
                    endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="paperHeight">Papierhöhe</FormLabel>
                <OutlinedInput 
                    id="paperHeight"
                    type="number"
                    name="paperHeight"
                    inputProps={{ step: "any" }}
                    fullWidth
                    endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="paperWidth">Papierbreite</FormLabel>
                <OutlinedInput
                    id="paperWidth"
                    type="number"
                    name="paperWidth"
                    inputProps={{ step: "any" }}
                    fullWidth
                    endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="price">Preis *</FormLabel>
                <OutlinedInput 
                    id="price"
                    type="number"
                    name="price"
                    required
                    inputProps={{ step: "any" }}
                    fullWidth
                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="annotations">Anmerkungen</FormLabel>
                <TextField
                    id="annotations"
                    type="text"
                    name="annotations"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
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