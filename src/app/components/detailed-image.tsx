"use client"

import styles from "@/src/app/components/detailed-image.module.css";
import { ImageConfigurator } from "@/src/app/components/image-configurator";
import { Image } from "@/src/app/models/image";
import { numberToCurrency } from "@/src/app/utils/number-to-currency";
import {Box, Button, CircularProgress, Divider, Typography} from "@mui/material";
import {usePathname} from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

export function DetailedImage({ isTrader }: { isTrader: boolean }) {
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

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && image && category && (
                <Box>
                    <Box className={"actions_container"}>
                        {isTrader && (
                            <Button
                                variant={"text"}
                                href={`/image/${imageId}/edit`}
                            >
                                Edit
                            </Button>
                        )}
                    </Box>

                    <Box className={styles.container}>

                        <Box className={styles.container__left}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                        {image.imageHeight && "Motivhöhe: " + image.imageHeight + " cm"}
                                    </Typography>

                                    <Typography
                                        variant={"body1"}
                                        className={styles.container__right}
                                    >
                                        {image.imageWidth && "Motivbreite: " + image.imageWidth + " cm"}
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

                            <ImageConfigurator
                                imageId={image.id}
                                isTrader={isTrader}
                            />

                            <Divider className={"divider_spacing"} />

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