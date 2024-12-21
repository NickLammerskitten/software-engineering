"use client";

import { Box, Checkbox, Chip, CircularProgress, FormControl, Grid2, InputLabel, ListItemText, MenuItem, OutlinedInput, Pagination, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { ImageResponseData } from "../api/models/image.model";
import { ImageCard } from "./image-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./gallery.module.css";
import { Key, Search } from "@mui/icons-material";
import { useDebouncedCallback } from "use-debounce";

const fallbackImageUrl = "images/no-photo.jpg";
const SEARCH_DEBOUNCE_TIMEOUT = 300;

export function Gallery() {
    const [images, setImages] = useState<ImageResponseData[] | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [totalImageCount, setTotalImageCount] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentPage = Number.parseInt(searchParams.get("page") ?? "1");

    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
                setLoadingCategories(false);
            });
    }, []);

    const handleCategoryChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [searchQuery, setSearchQuery] = useState<string>("");
    const debouncedSetSearchQuery = useDebouncedCallback((query: string) => {
        setSearchQuery(query);
    }, SEARCH_DEBOUNCE_TIMEOUT);
    const handleSearchChange = (event: any) => {
        debouncedSetSearchQuery(event.target.value);
    }

    useEffect(() => {
        (async () => {
            const apiParams = new URLSearchParams({
                page: (currentPage - 1).toString(),
                category: selectedCategories.join(","),
                query: searchQuery,
            }).toString();
            const response = await fetch("api/image?" + apiParams, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const json = await response.json();

            if (!response.ok) {
                setLoadingError(json["message"]);
                return;
            }

            setImages(json["data"]);
            setTotalImageCount(Math.ceil(json["total"] / json["pageSize"]));
        })();
    }, [currentPage, selectedCategories, searchQuery]);

    const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", value.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    return loadingError ? <div>{loadingError}</div> : images === null ? <CircularProgress /> : <>
        <div>
            {loadingCategories ? (<CircularProgress />) : (<>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Kategorien</InputLabel>
                    <Select
                        multiple
                        autoWidth
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        input={<OutlinedInput label="Kategorien" />}
                        renderValue={(selected: any) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value: any) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250,
                                },
                            },
                        }}
                    >
                        {categories.map(category => (
                            <MenuItem
                                key={category.id}
                                value={category.name}
                            >
                                <Checkbox checked={selectedCategories.includes(category.name)} />
                                <ListItemText primary={category.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </>)}
            <TextField 
                label="Suchen"
                variant="outlined"
                sx={{minWidth: 400}}
                onChange={handleSearchChange}
                slotProps={{
                    input: {
                        endAdornment: <Search />,
                    }
                }}
            />
        </div>

        <Grid2
            container
            spacing={3}
        >
            {images.map((image, index) => {
                return <Grid2 key={index} size={3} minWidth={250}>
                    <ImageCard
                        url={image.image_url ?? fallbackImageUrl}
                        artist={image.artist}
                        title={image.title}
                        onClick={() => {
                            router.push(`/image/${image.id}`)
                        }}
                    />
                </Grid2>;
            })}
        </Grid2>

        <div className={styles.pagination_container}>
            <Pagination page={currentPage} count={totalImageCount} color="primary" onChange={handlePagination} />
        </div>
    </>;
}
