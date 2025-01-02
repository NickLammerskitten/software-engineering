"use client"

import { ImageConfigurationList } from "@/src/app/components/image-configuration-list";
import { Portfolio } from "@/src/app/models/portfolio";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    FormLabel,
    TextField,
    Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

export function EditPortfolioForm() {
    const { enqueueSnackbar } = useSnackbar();
    const pathname = usePathname();

    const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(true);
    const [portfolioId, setPortfolioId] = useState<string | null>(null);

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [portfolioNameValid, setPortfolioNameValid] = useState<boolean>(true)

    useEffect(() => {
        fetchData();
    }, [pathname]);

    useEffect(() => {
        if (portfolio?.name == null || portfolio?.name == "") {
            setPortfolioNameValid(true);
            return;
        }

        const valid = nameRegEx.test(portfolio?.name);
        setPortfolioNameValid(valid);
    }, [portfolio]);

    const fetchData = async () => {
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
                    enqueueSnackbar(json.message, { variant: "error" });
                }

                return json;
            })
            .then((data: { data: Portfolio }) => {
                setPortfolio(data.data);
                setLoadingPortfolio(false);
            });
    }

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

        const json = await response.json();

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        enqueueSnackbar(json.message, { variant: "success" });
    }

    return (
        <>
            {loadingPortfolio ? (<CircularProgress />)
                : portfolio !== null ? (
                    <form
                        className={"form_container"}
                        id={"edit-portfolio-form"}
                        action={(value) => handleSubmit(value)}
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
                    <Divider className={"divider_spacing"} />

                    <ImageConfigurationList portfolioId={portfolio.id} />
                </>
            )}
        </>
    )
}