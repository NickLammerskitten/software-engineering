"use client";

import { Portfolio } from "@/src/app/models/portfolio.model";
import { Edit } from "@mui/icons-material";
import { Alert, Box, Card, CircularProgress, IconButton } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

export function PortfolioList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [portfolioListError, setPortfolioListError] = useState<string>("");

    useEffect(() => {
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

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && portfolios.length > 0 && (
                <Box className={"items_list"}>
                    {portfolios.map((portfolio) => (
                        <Fragment key={portfolio.id}>
                            <Card
                                key={portfolio.id}
                                className={"item"}
                            >
                                <Box>
                                    {portfolio.name}
                                    <p>{portfolio.description}</p>
                                </Box>

                                <Box>
                                    <IconButton href={`portfolio/${portfolio.id}/edit`}>
                                        <Edit />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Fragment>
                    ))}
                </Box>
            )}

            {portfolioListError !== "" && (
                <Alert severity="error">
                    {portfolioListError}
                </Alert>
            )}
        </div>
    )
}