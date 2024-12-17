"use client"

import { Image } from "@/src/app/models/image.model";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/src/app/components/detailed-image.module.css";

export function DetailedImage() {
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [imageId, setImageId] = useState<string | null>(null);

    const [image, setImage] = useState<Image | null>(null);

    useEffect(() => {
        setLoading(true);

        const imageId = searchParams.get('id') as string | null;
        setImageId(imageId);

        if (imageId == null) {
            setLoading(false);
            setImage(null);
            return;
        }

        /*fetch(`/api/gallery/${imageId}`)
            .then((res) => {
                if (!res.ok) {
                    setLoading(false);
                    throw new Error("Error fetching image");
                }

                return res.json();
            })
            .then((data: { data: Image }) => {
                setImage(data.data);
                setLoading(false);
            });*/

        // TODO: Remove this when the fetch is implemented
        setImage({
            id: imageId,
            categoryId: 1,
            title: 'Test Titel',
            description: 'Test Beschreibung',
            imageHeight: 1,
            imageWidth: 1,
            paperHeight: 1,
            paperWidth: 1,
            annotations: 'Test Anmerkung',
            price: 1.99,
            artist: 'Test Künstler',
            imagePath: null
        })
        setLoading(false);
    }, [searchParams]);

    return (
        <div>
            {loading && (<CircularProgress/>)}

            {!loading && image && (
                <Box className={styles.container}>
                    {image.imagePath ? (
                        <img src={image.imagePath} alt={image.title}/>
                    ) : (
                        <Box className={styles.container__image}>
                            <Typography>
                                No image found
                            </Typography>
                        </Box>
                    )}

                    <Box className={styles.container__info}>

                        <Typography variant={"h1"}>
                            {image.title}
                        </Typography>

                        <Typography variant={"subtitle1"}>
                            Künstler: {image.artist}
                        </Typography>

                        <Typography variant={"body1"}>
                            {image.price}
                        </Typography>

                        <Typography variant={"body1"}>
                            {image.description}
                        </Typography>

                        <Typography variant={"body1"}>
                            {image.annotations && "Anmerkungen: " + image.annotations}
                        </Typography>

                        <Typography variant={"body1"}>
                            {"Kennung: " + image.id}
                        </Typography>
                    </Box>

                </Box>
            )}
        </div>
    );
}