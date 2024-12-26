"use client"


import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Image} from "@/src/app/models/image.model";
import {
    Alert, Box, Button,
    CircularProgress,
    FormControl,
    FormLabel, InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from "@mui/material";
import * as React from "react";
import styles from "@/src/app/components/detailed-image.module.css";
const successMessage: string = "Bild erfolgreich geändert!";
const errorMessage: string = "Fehler beim Bearbeiten des Bildes!";
export default function EditImageForm() {
    const pathname = usePathname();
    const router = useRouter();
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [, setImageId] = useState<string | null>(null);
    const [image, setImage] = useState<Image | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState< Category | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setLoading(true);

        const imageId = pathname.split('/').pop() as string;
        setImageId(imageId);

        if (imageId == null) {
            setLoading(false);
            setImage(null);
            return;
        }

        fetch(`/api/image/${imageId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    throw new Error(`Error while fetching image (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Image }) => {
                setImage(data.data);
                setLoading(false);
            });
    }, [pathname]);

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

    useEffect(() => {
        if (image == null) {
            return;
        }

        fetch(`/api/category/${image.categoryId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    throw new Error(`Error while fetching category (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Category }) => {
                setCategory(data.data);
            });
    }, [image]);


    const handleChange = () => {
        setSuccess(undefined);
    }

    const handleSubmit = async (formData: FormData) => {
        const data = {
            id: image?.id,
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

        }

        await fetch(`/api/image`, {
            body: JSON.stringify({ formData: data }),
            method: "PUT",
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

            router.push('/');

            return response.json();

        });
    }


    return(
        <div>
            {loading && (<CircularProgress />)}

            {!loading && image && category && (

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
                            defaultValue={image.title}
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
                            defaultValue={image.artist}
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
                            defaultValue={image.description}
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
                            defaultValue={image.imageHeight}
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
                            defaultValue={image.imageWidth}
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
                            defaultValue={image.paperHeight}
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
                            defaultValue={image.paperWidth}
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
                            defaultValue={image.price}
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
                            defaultValue={image.annotations}
                        />
                    </FormControl>
                    <Box className={styles.container__left}>
                        <img className={styles.img} src={image.image_url || "/images/no-photo.jpg"} alt={image.title} />
                    </Box>

                    {success === true && <Alert severity="success">{successMessage}</Alert>}
                    {success === false && <Alert severity="error">{errorMessage}</Alert>}

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
                )}
        </div>
        )

}