import { ImageCard } from "@/src/app/components/image-card";
import { numberToCurrency } from "@/src/app/utils/number-to-currency";
import { Remove } from "@mui/icons-material";
import { Alert, CircularProgress, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fallbackImageUrl = "/images/no-photo.jpg";

interface ImageConfiguration {
    id: string;
    byTrader: boolean;
    imageId: string;
    title: string;
    artist: string;
    imageUrl: string | null;
    imagePrice: number;
}

export function ImageConfigurationList({ portfolioId }: { portfolioId: string }) {
    const router = useRouter();

    const [loadingImageConfigurations, setLoadingImageConfigurations] = useState<boolean>(true);
    const [imageConfigurations, setImageConfigurations] = useState<ImageConfiguration[]>([]);
    const [imageConfigurationsErrorMessages, setImageConfigurationsErrorMessages] = useState<{
        [id: string]: string
    }>({})

    const [totalPrice, setTotalPrice] = useState<number | null>(null)

    useEffect(() => {
        fetchData();
    }, [portfolioId]);

    useEffect(() => {
        const totalPrice = imageConfigurations.reduce((acc, image) => acc + image.imagePrice, 0);
        setTotalPrice(totalPrice);
    }, [imageConfigurations]);

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
            .then((data: { data: ImageConfiguration[] }) => {
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
                                router.push(`/image/${image.imageId}`)
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

            <Typography
                variant={"h5"}
                className={"top_space"}>
                Gesamtpreis: {numberToCurrency(totalPrice ?? 0)}
            </Typography>
        </>
    )
}