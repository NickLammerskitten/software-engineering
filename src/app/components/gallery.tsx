"use client";

import { CircularProgress, Grid2, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { ImageResponseData } from "../api/models/image.model";
import { ImageCard } from "./image-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./gallery.module.css";

const fallbackImageUrl = "images/no-photo.jpg";

export function Gallery() {
    const [images, setImages] = useState<ImageResponseData[] | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [totalImageCount, setTotalImageCount] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentPage = Number.parseInt(searchParams.get("page") ?? "1");

    useEffect(() => {
        (async () => {
            const apiParams = new URLSearchParams({
                page: (currentPage - 1).toString(),
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
    }, [currentPage]);

    const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", value.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    return loadingError ? <div>{loadingError}</div> : images === null ? <CircularProgress /> : <>
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
