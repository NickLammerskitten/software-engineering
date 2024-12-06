"use client";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export function ImagesList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [images, setImages] = useState<Image[]>([]);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/gallery/${1}/${20}`)
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                setImages(data.data);
            });
    }, []);

    return (
        <>
            {loading ? <Box>Loading...</Box>
                : images.length === 0 ? <Box>No images found</Box>
                    : (
                        <>
                            {images.map((image) => (
                                <Box key={image.id}>{image.title}</Box>
                            ))}
                        </>
                    )}
        </>
    );
}