"use client"

import { ImageUpload } from "@/src/app/utils/image-upload";
import { ExpandMore } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    Checkbox
} from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useState } from "react";
import { PaletteSelector } from "./palette-selector";
import { StripSelector } from "./strip-selector";

import styles from "./add-image-form.module.css";

export default function AddImageForm() {
    const { enqueueSnackbar } = useSnackbar();

    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    const [image_url, setImageUrl] = useState<string | undefined>(undefined);

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

    const [expanded, setExpanded] = React.useState(false);

    const handleSubmit = async (formData: FormData) => {
        const imagePayload = {
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
        };

        const response = await fetch(`/api/image`, {
            body: JSON.stringify({ formData: imagePayload }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        if (formData.get("palette-select") || formData.get("strip-select") || formData.get("passepartout")) {
            const configurationPayload = {
                imageId: json.data.id,
                portfolioId: null,
                paletteId: !formData.get("palette-select") ? null : formData.get("palette-select"),
                stripId: !formData.get("strip-select") ? null : formData.get("strip-select"),
                passepartout: !formData.get("passepartout") ? false : formData.get("passepartout") === "on",
            };

            const configurationResponse = await fetch("/api/portfolio/configuration", {
                body: JSON.stringify({ formData: configurationPayload }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!configurationResponse.ok) {
                const responseJson = await configurationResponse.json();
                enqueueSnackbar(responseJson.message, { variant: "error" });
                return;
            }
        }

        const form = document.getElementById("add-image-form") as HTMLFormElement;
        form.reset();

        enqueueSnackbar(json.message, { variant: "success" });

    }

    return (
        <form
            className={"form_container"}
            id={"add-image-form"}
            action={(value) => handleSubmit(value)}
        >
            {loadingCategories ? (<CircularProgress />)
                : (
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
                <FormLabel htmlFor="imageHeight">Motivhöhe</FormLabel>
                <OutlinedInput
                    id="imageHeight"
                    type="number"
                    name="imageHeight"
                    inputProps={{ step: "any", min: 0 }}
                    fullWidth
                    endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="imageWidth">Motivbreite</FormLabel>
                <OutlinedInput
                    id="imageWidth"
                    type="number"
                    name="imageWidth"
                    inputProps={{ step: "any", min: 0 }}
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
                    inputProps={{ step: "any", min: 0 }}
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
                    inputProps={{ step: "any", min: 0 }}
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
                    inputProps={{ step: "any", min: 0 }}
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

            <div className={styles.preconfig_expand}>
                <Typography variant="h5">
                    Vorkonfiguration
                </Typography>
                <IconButton onClick={() => setExpanded(!expanded)}>
                    <ExpandMore style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.2s" }} />
                </IconButton>
            </div>
            <Collapse in={expanded} timeout="auto" className={"form_container"} unmountOnExit >
                <div className={"form_container"}>
                    <PaletteSelector />
                    <StripSelector />
                    <FormControlLabel
                        name={"passepartout"}
                        control={<Checkbox />}
                        label="Passepartout"
                    />
                </div>
            </Collapse>

            <ImageUpload setImageUrl={setImageUrl} />

            <Box className={"actions_container"}>
                <Button
                    variant={"text"}
                    type={"reset"}
                    href="/gallery"
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
