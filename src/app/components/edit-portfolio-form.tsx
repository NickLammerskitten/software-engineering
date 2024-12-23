"use client"

import { ImageCard } from "@/src/app/components/image-card";
import { Portfolio } from "@/src/app/models/portfolio.model";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormLabel,
    Grid2,
    TextField,
    Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fallbackImageUrl = "/images/no-photo.jpg";

const successMessage: string = "Themenmappe erfolgreich bearbeitet!";
const errorMessage: string = "Fehler beim Bearbeiten der Themenmappe!";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

interface ImageConfiguration {
    id: string;
    byTrader: boolean;
    imageId: string;
    title: string;
    artist: string;
    imageUrl: string | null;
}

export function EditPortfolioForm() {
    const pathname = usePathname();
    const router = useRouter();

    const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(true);
    const [portfolioId, setPortfolioId] = useState<string | null>(null);

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [portfolioNameValid, setPortfolioNameValid] = useState<boolean>(true)

    const [loadingImageConfigurations, setLoadingImageConfigurations] = useState<boolean>(true);
    const [imageConfigurations, setImageConfigurations] = useState<ImageConfiguration[]>([]);

    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setLoadingPortfolio(true);

        const pathnames = pathname.split('/') as string[];
        pathnames.pop();
        const portfolioId = pathnames.pop() as string;

        setPortfolioId(portfolioId);

        if (portfolioId == null) {
            setLoadingPortfolio(false);
            setPortfolio(null);
            return;
        }

        fetch(`/api/portfolio/${portfolioId}`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoadingPortfolio(false);
                    throw new Error(`Error while fetching portfolio (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Portfolio }) => {
                setPortfolio(data.data);
                setLoadingPortfolio(false);
            });

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
    }, [pathname]);

    useEffect(() => {
        if (portfolio?.name == null || portfolio?.name == "") {
            setPortfolioNameValid(true);
            return;
        }

        const valid = nameRegEx.test(portfolio?.name);
        setPortfolioNameValid(valid);
    }, [portfolio]);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            id: portfolioId,
            name: formData.get("name"),
            description: formData.get("description"),
        }

        if (!portfolioNameValid) {
            return;
        }

        const response = await fetch(`/api/portfolio`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formData: data,
            }),
        });

        if (!response.ok) {
            setSuccess(false);
            return;
        }

        setSuccess(true);
    }

    const handleChange = () => {
        setSuccess(undefined);
    }

    return (
        <>
            {loadingPortfolio ? (<CircularProgress />)
                : portfolio !== null ? (
                    <form
                        className={"form_container"}
                        id={"edit-portfolio-form"}
                        action={(value) => handleSubmit(value)}
                        onChange={handleChange}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Name *</FormLabel>
                            <TextField
                                id="name"
                                type="text"
                                name="name"
                                required
                                fullWidth
                                variant="outlined"
                                value={portfolio.name}
                                onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })}
                                helperText={portfolioNameValid
                                    ? ""
                                    : "Der Name muss zwischen 3 und 30 Zeichen lang sein und darf Zeichen" +
                                    " von a bis z, sowie Zahlen von 0 bis 9 enthalten."}
                                error={!portfolioNameValid}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <FormLabel htmlFor="title">Beschreibung</FormLabel>
                            <TextField
                                id="description"
                                type="text"
                                name="description"
                                fullWidth
                                variant="outlined"
                                value={portfolio.description}
                                onChange={(e) => setPortfolio({ ...portfolio, description: e.target.value })}
                                multiline
                                rows={4}
                            />
                        </FormControl>

                        {success === true && <Alert severity="success">{successMessage}</Alert>}
                        {success === false && <Alert severity="error">{errorMessage}</Alert>}

                        <Box className={"actions_container"}>
                            <Button
                                variant={"text"}
                                type={"reset"}
                                href="/portfolio"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant={"contained"}
                                type={"submit"}
                            >
                                Speichern
                            </Button>
                        </Box>
                    </form>
                ) : (
                    <Typography variant={"body1"}>
                        Es ist ein unerwarteter Fehler aufgetreten.
                    </Typography>
                )}

            {portfolio !== null && (
                <>
                    <Typography
                        variant={"h4"}
                        className={"top_space"}
                    >
                        Bilder
                    </Typography>

                    {loadingImageConfigurations && (<CircularProgress />)}

                    {!loadingImageConfigurations && imageConfigurations.length === 0 && (
                        <Typography variant={"body1"}>
                            Es wurden noch keine Bilder hinzugefügt.
                        </Typography>
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
                                    onClick={() => {
                                        router.push(`/image/${image.imageId}`)
                                    }}
                                />
                            </Grid2>;
                        })}
                    </Grid2>
                </>
            )}
        </>
    )
}