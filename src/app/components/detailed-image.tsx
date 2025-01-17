"use client"

import styles from "@/src/app/components/detailed-image.module.css";
import { ImageConfigurator } from "@/src/app/components/image-configurator";
import { Image } from "@/src/app/models/image";
import { ImageConfiguration } from "@/src/app/models/portfolio";
import { numberToCurrency } from "@/src/app/utils/number-to-currency";
import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";

interface DetailedImageProps {
    isTrader: boolean;
    imageId: string | null;
    configurationId: string | null;
}

export function DetailedImage({ isTrader, imageId, configurationId }: DetailedImageProps) {
    const [loadingImage, setLoadingImage] = useState<boolean>(true);
    const [image, setImage] = useState<Image | null>(null);
    const [category, setCategory] = useState<Category | null>(null);

    const [loadingConfiguration, setLoadingConfiguration] = useState<boolean>(true);
    const [configuration, setConfiguration] = useState<ImageConfiguration | null>(null);

    const fetchImage = async (imageId: string) => {
        setLoadingImage(true);

        return fetch(`/api/image/${imageId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoadingImage(false);
                    throw new Error(`Error while fetching image (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Image }) => {
                setImage(data.data);
                setLoadingImage(false);
                return data.data;
            });
    }

    const fetchConfiguration = async (configurationId: string) => {
        setLoadingConfiguration(true);

        return fetch(`/api/portfolio/configuration/${configurationId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoadingConfiguration(false);
                    throw new Error(`Error while fetching configuration (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: ImageConfiguration | null }) => {
                setConfiguration(data.data);
                setLoadingConfiguration(false);
                return data.data;
            });
    }

    useEffect(() => {
        if (configurationId == null && imageId == null) {
            throw new Error("Either imageId or configurationId must be set");
        }

        if (configurationId == null) {
            // when configurationId is not set, fetch image directly
            fetchImage(imageId as string).then((image) => {
                // fetch standard configuration if set
                if (image.standardConfigurationId == null) {
                    setLoadingConfiguration(false);
                    return;
                }

                fetchConfiguration(image.standardConfigurationId);
            });

        } else {
            // when configurationId is set, fetch configuration and then image
            fetchConfiguration(configurationId).then((imageConfiguration) => {
                fetchImage(imageConfiguration!.imageId);
            })
        }
    }, [imageId, configurationId]);

    useEffect(() => {
        if (image == null) {
            return;
        }

        fetch(`/api/category/${image.categoryId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoadingImage(false);
                    throw new Error(`Error while fetching category (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Category }) => {
                setCategory(data.data);
            });
    }, [image]);

    if (imageId == null && configurationId == null) {
        return (
            <>Es ist kein Bild, als auch keine Bildkonfiguration vorhanden</>
        );
    }

    return (
        <div>
            {loadingImage && (<CircularProgress />)}

            {!loadingImage && image && category && (
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

                            {loadingConfiguration ? (<CircularProgress />) : (
                                <ImageConfigurator
                                    imageId={image.id}
                                    configurationId={configurationId}
                                    imageConfiguration={configuration}
                                    isTrader={isTrader}
                                />
                            )}

                            <Divider className={"divider_spacing"} />

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
                </Box>
            )}
        </div>
    );
}
