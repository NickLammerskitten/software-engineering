"use client";

import { Portfolio } from "@/src/app/models/portfolio.model";
import { useConfirmDialog } from "@/src/app/utils/confirm-dialog-hook";
import { Delete, Edit } from "@mui/icons-material";
import { Alert, Box, Card, CircularProgress, IconButton } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

export function PortfolioList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [errorMessages, setErrorMessages] = useState<{ [id: string]: string }>({});
    const [portfolioListError, setPortfolioListError] = useState<string>("");

    const { showConfirm, ConfirmDialogComponent } = useConfirmDialog();

    useEffect(() => {
        setErrorMessages({});
        setPortfolioListError("");
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        setLoading(true);

        const response = await fetch(`/api/portfolio/my`);

        const json = await response.json();

        setLoading(false);

        if (!response.ok) {
            setPortfolioListError(`Error while fetching portfolios (${response.status}): ${json["message"]}`);
            return;
        }

        setPortfolios(json["data"]);
    }

    const deletePortfolio = async (id: string) => {
        const response = await fetch(`/api/portfolio/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const json = await response.json();

        if (!response.ok) {
            errorMessages[id] = `Error ${response.status}: ${json["message"]}`;
            setErrorMessages({ ...errorMessages });
            return;
        }


        await fetchPortfolios();
    };

    const handleDelete = (id: string) => {
        showConfirm(
            "Möchtest du dieses Portfolio wirklich löschen?",
            "",
            () => {
                deletePortfolio(id);
            }
        );
    };

    return (
        <div>
            {loading ? (<CircularProgress />) : (portfolios && portfolios.length > 0) ? (
                <Box className={"items_list"}>
                    {portfolios.map((portfolio) => (
                        <Fragment key={portfolio.id}>
                            <Card
                                key={portfolio.id}
                                className={"item"}
                            >
                                {portfolio.name}

                                <Box>
                                    <IconButton href={`portfolio/${portfolio.id}/edit`}>
                                        <Edit />
                                    </IconButton>

                                    <IconButton onClick={() => handleDelete(portfolio.id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Card>
                            {errorMessages[portfolio.id] &&
                                <Alert severity="error">
                                    {errorMessages[portfolio.id]}
                                </Alert>
                            }
                        </Fragment>
                    ))}
                </Box>
            ) : (
                <Alert severity="info">
                    Keine Portfolios vorhanden.
                </Alert>
            )}

            {portfolioListError !== "" && (
                <Alert severity="error">
                    {portfolioListError}
                </Alert>
            )}

            {ConfirmDialogComponent}
        </div>
    )
}