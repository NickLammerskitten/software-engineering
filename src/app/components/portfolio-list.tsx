"use client";

import { Portfolio } from "@/src/app/models/portfolio.model";
import { Alert, Box, Card, CircularProgress } from "@mui/material";
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
                                {portfolio.name}
                                <p>{portfolio.description}</p>
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