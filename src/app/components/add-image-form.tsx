"use client"

import { FormControl, FormLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import * as React from "react";
import { useState } from "react";

export function AddImageForm() {
    // TODO: Fetch categories from database
    const [categories, setCategories] = useState([
        { value: 1, label: "Kategorie 1" },
        { value: 2, label: "Kategorie 2" },
        { value: 3, label: "Kategorie 3" },
    ]);

    const [selectedCategory, setSelectedCategory] = useState(categories[0].value);

    return (
        <form className={"form_container"}>
            <FormControl fullWidth>
                <InputLabel id="category-select">Kategorie</InputLabel>
                <Select
                    label={"Kategorie"}
                    id={"category-select"}
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
                <FormLabel htmlFor="title">Titel</FormLabel>
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
                    name="Beschreibung"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="imageHeight">Bildhöhe (in cm)</FormLabel>
                <TextField
                    id="imageHeight"
                    type="number"
                    name="Bildhöhe"
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="imageWidht">Bildbreite (in cm)</FormLabel>
                <TextField
                    id="imageWidht"
                    type="number"
                    name="Bildbreite"
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="paperHeight">Papierhöhe (in cm)</FormLabel>
                <TextField
                    id="paperHeight"
                    type="number"
                    name="Papierhöhe"
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="paperWidth">Papierbreite (in cm)</FormLabel>
                <TextField
                    id="paperWidth"
                    type="number"
                    name="Papierbreite"
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="price">Preis (in €)</FormLabel>
                <TextField
                    id="price"
                    type="number"
                    name="Preis"
                    required
                    defaultValue={999.99}
                    fullWidth
                    variant="outlined"
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="annotations">Anmerkungen</FormLabel>
                <TextField
                    id="annotations"
                    type="text"
                    name="Anmerkungen"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                />
            </FormControl>
        </form>
    )
}