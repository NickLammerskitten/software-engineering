"use client"

import styles from "@/src/app/components/detailed-image.module.css";
import { Image } from "@/src/app/models/image.model";
import { numberToCurrency } from "@/src/app/utils/number-to-currency";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function DetailedImage() {
    const pathname = usePathname();

    const [loading, setLoading] = useState<boolean>(true);
    const [imageId, setImageId] = useState<string | null>(null);

    const [image, setImage] = useState<Image | null>(null);
    const [category, setCategory] = useState<Category | null>(null);

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
            });
    }, [pathname]);

    useEffect(() => {
        if (image == null) {
            return;
        }

        fetch(`/api/category/${image.categoryId}`)
            .then((res) => {
                if (!res.ok) {
                    setLoading(false);
                    throw new Error("Error fetching image");
                }

                return res.json();
            })
            .then((data: { data: Category }) => {
                setCategory(data.data);
            });
    }, [image]);

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && image && category && (
                <Box>
                    <Box className={styles.container}>

                        <Box className={styles.container__left}>
                            <img
                                className={styles.img}
                                src={image.image_url || "/images/no-photo.jpg"}
                                alt={image.title}
                            />
                        </Box>

                        <Box className={styles.container__right}>
                            <Typography variant={"h1"}>
                                {image.title}
                            </Typography>

                            <Box className={styles.container__right}>
                                <Box className={styles.container}>
                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__left}
                                    >
                                        Künstler: {image.artist}
                                    </Typography>

                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__right}
                                    >
                                        {"Kategorie: " + category.name}
                                    </Typography>
                                </Box>

                                <Box className={styles.container}>
                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__left}
                                    >
                                        {image.imageHeight && "Höhe: " + image.imageHeight + " cm"}
                                    </Typography>

                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__right}
                                    >
                                        {image.imageWidth && "Breite: " + image.imageWidth + " cm"}
                                    </Typography>
                                </Box>

                                <Box
                                    className={styles.container + " bottom_space"}
                                >
                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__left}
                                    >
                                        {image.paperHeight && "Papierhöhe: " + image.paperHeight + " cm"}
                                    </Typography>

                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__right}
                                    >
                                        {image.paperWidth && "Papierbreite: " + image.paperWidth + " cm"}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography
                                variant={"h4"}
                                className={"bottom_space"}
                            >
                                {numberToCurrency(image.price)}
                            </Typography>

                            <Divider className={styles.divider_spacing} />

                            <Typography variant={"body1"}>
                                {image.description}
                            </Typography>

                            <Typography variant={"body1"}>
                                {image.annotations && "Anmerkungen: " + image.annotations}
                            </Typography>

                            <Typography variant={"body1"}>
                                {"Kennung: " + imageId}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </div>
    );
}