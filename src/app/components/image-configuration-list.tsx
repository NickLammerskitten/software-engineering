import { ImageCard } from "@/src/app/components/image-card";
import { Remove } from "@mui/icons-material";
import { Alert, CircularProgress, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fallbackImageUrl = "/images/no-photo.jpg";

interface MinimalImageConfiguration {
    id: string;
    byTrader: boolean;
    imageId: string;
    title: string;
    artist: string;
    imageUrl: string | null;
}

export function ImageConfigurationList({ portfolioId }: { portfolioId: string }) {
    const router = useRouter();

    const [loadingImageConfigurations, setLoadingImageConfigurations] = useState<boolean>(true);
    const [imageConfigurations, setImageConfigurations] = useState<MinimalImageConfiguration[]>([]);
    const [imageConfigurationsErrorMessages, setImageConfigurationsErrorMessages] = useState<{
        [id: string]: string
    }>({})

    useEffect(() => {
        fetchData();
    }, [portfolioId]);

    const fetchData = async () => {
        setLoadingImageConfigurations(true);
        fetch(`/api/portfolio/${portfolioId}/configuration`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoadingImageConfigurations(false);
                    throw new Error(`Error while fetching portfolio configurations (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: MinimalImageConfiguration[] }) => {
                setImageConfigurations(data.data);
                setLoadingImageConfigurations(false);
            });
    }

    const removeImageConfiguration = async (imageConfigurationId: string) => {
        const response = await fetch(`/api/portfolio/configuration/${imageConfigurationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();

        if (!response.ok) {
            imageConfigurationsErrorMessages[imageConfigurationId] = `Error ${response.status}: ${json["message"]}`;
            setImageConfigurationsErrorMessages({ ...imageConfigurationsErrorMessages });
            return;
        }

        fetchData();
    }

    return (
        <>
            <Typography
                variant={"h4"}
                className={"top_space"}
            >
                Bilder
            </Typography>

            {loadingImageConfigurations && (<CircularProgress />)}

            {!loadingImageConfigurations && imageConfigurations.length === 0 && (
                <Alert severity="info">
                    Keine Bilder vorhanden.
                </Alert>
            )}

            <Grid2
                container
                spacing={3}
            >
                {imageConfigurations.map((image, index) => {
                    return <Grid2
                        key={index}
                        size={3}
                        minWidth={250}
                    >
                        <ImageCard
                            url={image.imageUrl ?? fallbackImageUrl}
                            artist={image.artist}
                            title={image.title}
                            addedByTrader={image.byTrader}
                            onClick={() => {
                                router.push(`/portfolio/${portfolioId}/configuration/${image.id}`);
                            }}
                            subactionIcon={<Remove />}
                            subactionTooltip={"Entfernen"}
                            onSubactionClick={() => {
                                removeImageConfiguration(image.id);
                            }}
                        />
                    </Grid2>;
                })}
            </Grid2>
        </>
    )
}