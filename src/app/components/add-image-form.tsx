"use client"

import { ImageUpload } from "@/src/app/utils/image-upload";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";

const successMessage: string = "Bild erfolgreich hinzugefügt!";
const errorMessage: string = "Fehler beim Hinzufügen des Bildes!";

export default function AddImageForm() {
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    const [image_url, setImageUrl] = useState<string | undefined>(undefined);

    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setLoadingCategories(true);
        fetch(`/api/category`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error fetching categories");
                }

                return res.json();
            })
            .then((data: { data: Category[] }) => {
                setCategories(data.data);
                if (data.data.length > 0) {
                    setSelectedCategory(data.data[0].id)
                }

                setLoadingCategories(false);
            });
    }, []);



    const handleSubmit = async (formData: FormData) => {
        const data = {
            categoryId: formData.get("category-select"),
            title: formData.get("title"),
            artist: formData.get("artist"),
            description: formData.get("description"),
            imageHeight: formData.get("imageHeight"),
            imageWidth: formData.get("imageWidth"),
            paperHeight: formData.get("paperHeight"),
            paperWidth: formData.get("paperWidth"),
            price: formData.get("price"),
            annotations: formData.get("annotations"),
            image_url: image_url,
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
            {loadingCategories ? (<CircularProgress />)
                : (
                    <>
                        <FormControl fullWidth>
                            <InputLabel id="category-select">Kategorie *</InputLabel>
                            <Select
                                label={"Kategorie *"}
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
                                        key={category.id}
                                        value={category.id}
                                    >{category.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}

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
                <FormLabel htmlFor="title">Künstler *</FormLabel>
                <TextField
                    id="artist"
                    type="text"
                    name="artist"
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

            <ImageUpload setImageUrl={setImageUrl} />

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