"use client";

import { CircularProgress, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { ImageResponseData } from "../api/models/image.model";
import { ImageCard } from "./image-card";
import { useRouter } from "next/navigation";

const fallbackImageUrl = "images/no-photo.jpg";

export function Gallery() {
    const [images, setImages] = useState<ImageResponseData[]>([]);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const router = useRouter();

    const loadImages = async () => {
        const response = await fetch("api/image", {
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
    }

    useEffect(() => {
        loadImages();
    }, []);

    return loadingError ? <div>{loadingError}</div> : images.length === 0 ? <CircularProgress /> : <Grid2
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
    </Grid2>;
}
