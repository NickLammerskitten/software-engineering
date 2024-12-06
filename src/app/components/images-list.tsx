"use client";

import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function ImagesList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [images, setImages] = useState<Image[]>([]);
    const [totalImages, setTotalImages] = useState<number>(0);

    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);

    const handleNext = () => {
        setPage(page + 1);
    }

    const handlePrevious = () => {
        setPage(page - 1);
    }

    useEffect(() => {
        setLoading(true);
        fetch(`/api/gallery/${page}/${pageSize}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error fetching images");
                }

                return res.json();
            })
            .then((data) => {
                setLoading(false);
                setImages(data.data);
            });

        fetch(`/api/gallery/count`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error fetching total images");
                }

                return res.json();
            })
            .then((data) => {
                setTotalImages(data.data);
            });
    }, [page, pageSize]);

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

            <Box className={"actions_container"}>
                <IconButton
                    onClick={handlePrevious}
                    disabled={page === 0}
                >
                    <ArrowBack />
                </IconButton>

                <Typography>{page + 1}</Typography>

                <IconButton
                    onClick={handleNext}
                    disabled={(page + 1) * pageSize >= totalImages}
                >
                    <ArrowForward />
                </IconButton>
            </Box>
        </>
    );
}