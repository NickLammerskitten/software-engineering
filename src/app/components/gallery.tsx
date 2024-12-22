"use client";

import { 
    Box, 
    Checkbox, 
    Chip, 
    CircularProgress, 
    FormControl, 
    Grid2, 
    InputLabel, 
    ListItemText, 
    MenuItem, 
    OutlinedInput, 
    Pagination, 
    Select, 
    SelectChangeEvent, 
    TextField 
} from "@mui/material";
import { useEffect, useState } from "react";
import { ImageResponseData } from "../api/models/image.model";
import { ImageCard } from "./image-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./gallery.module.css";
import { Search } from "@mui/icons-material";

const fallbackImageUrl = "images/no-photo.jpg";

export function Gallery() {
    const [images, setImages] = useState<ImageResponseData[] | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [totalImageCount, setTotalImageCount] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [possibleCategories, setPossibleCategories] = useState<Category[]>([]);
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
                setPossibleCategories(data.data);
                setLoadingCategories(false);
            });
    }, []);

    const currentCategory = searchParams.get("category") ?? "";
    const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategory !== "" ? currentCategory.split(",") : []);
    const handleCategoryChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
        const content = event.target.value;

        setSelectedCategories(typeof content === 'string' ? content.split(',') : content);

        const params = new URLSearchParams(searchParams);
        if (content.length === 0) {
            params.delete("category");
        } else {
            params.set("category", typeof content === "string" ? content : content.join(","));
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const currentSearchQuery = searchParams.get("query") ?? "";
    const [searchQuery, setSearchQuery] = useState<string>(currentSearchQuery);
    const handleSearchInput = (event: any) => {
        const content = event.target.value;
        
        const params = new URLSearchParams(searchParams);
        if (content === "") {
            params.delete("query");
        } else {
            params.set("query", encodeURIComponent(content));
        }
        router.replace(`${pathname}?${params.toString()}`);
    };
    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    }

    const currentPage = Number.parseInt(searchParams.get("page") ?? "1");
    const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", value.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        (async () => {
            const apiParams = new URLSearchParams({
                page: (currentPage - 1).toString(),
                category: currentCategory,
                query: currentSearchQuery,
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
    }, [currentPage, currentSearchQuery, currentCategory]);

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
                        {possibleCategories.map(category => (
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
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={handleSearchInput}
                onKeyDown={(event) => {if (event.key === "Enter") handleSearchInput(event);}}
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
