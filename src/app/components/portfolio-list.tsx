"use client";

import { Portfolio } from "@/src/app/models/portfolio";
import { useConfirmDialog } from "@/src/app/utils/confirm-dialog-hook";
import { Delete, Edit } from "@mui/icons-material";
import { Alert, Box, Card, CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";

export function PortfolioList({ traderPortfolios, userId }: { traderPortfolios: boolean, userId: string }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

    const { showConfirm, ConfirmDialogComponent } = useConfirmDialog();

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        setLoading(true);

        const response = await fetch(`/api/portfolio`);

        const json = await response.json();

        setLoading(false);

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        const portfolios = json["data"] as Portfolio[];

        if (traderPortfolios) {
            setPortfolios(portfolios.filter((portfolio) => portfolio.owner_id === userId));
        } else {
            setPortfolios(portfolios.filter((portfolio) => portfolio.owner_id !== userId));
        }
    }

    const deletePortfolio = async (id: string) => {
        const response = await fetch(`/api/portfolio/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        enqueueSnackbar(json.message, { variant: "success" });
        await fetchPortfolios();
    };

    const handleDelete = (id: string) => {
        showConfirm(
            "Möchtest du dieses Portfolio wirklich löschen?",
            "",
            () => {
                deletePortfolio(id);
            },
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

                                    {traderPortfolios && (
                                        <IconButton onClick={() => handleDelete(portfolio.id)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            </Card>
                        </Fragment>
                    ))}
                </Box>
            ) : (
                <Alert severity="info">
                    Keine vorhanden.
                </Alert>
            )}

            {ConfirmDialogComponent}
        </div>
    )
}