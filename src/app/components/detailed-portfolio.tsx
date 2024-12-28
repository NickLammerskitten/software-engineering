"use client";

import { ImageConfigurationList } from "@/src/app/components/image-configuration-list";
import { Portfolio } from "@/src/app/models/portfolio.model";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function DetailedPortfolio() {
    const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(true);

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoadingPortfolio(true);

        fetch(`/api/portfolio/my`)
            .then(async (response) => {
                const json = await response.json();

                if (!response.ok) {
                    setLoadingPortfolio(false);
                    throw new Error(`Error while fetching portfolio (${response.status}): ${json["message"]}`);
                }

                return json;
            })
            .then((data: { data: Portfolio[] }) => {
                if (data.data.length === 0) {
                    setLoadingPortfolio(false);
                    setPortfolio(null);
                    return;
                }

                setPortfolio(data.data[0]);
                setLoadingPortfolio(false);
            });
    }

    return (
        <>
            {loadingPortfolio ? (<CircularProgress />)
                : portfolio !== null ? (
                    <>
                        <Typography variant={"body1"}>Name: {portfolio.name}</Typography>

                        {portfolio.description && (
                            <Typography variant={"body1"}>Beschreibung: {portfolio.description}</Typography>
                        )}

                        <Divider className={"divider_spacing"}/>

                        <ImageConfigurationList portfolioId={portfolio.id} />
                    </>
                ) : (
                    <Typography variant={"body1"}>
                        Es ist ein unerwarteter Fehler aufgetreten.
                    </Typography>
                )}
        </>
    )
}