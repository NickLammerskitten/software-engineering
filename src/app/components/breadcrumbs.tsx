'use client'
import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from 'next/navigation';

const Breadcrumbs: React.FC = () => {
    const location = usePathname();
    const pathnames = location.split("/").filter((x) => x);

    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {pathnames.length === 0 ? null : (
                <>
                </>
            )}

            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <Typography key={to} color="text.primary">
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Typography>
                ) : (
                    <>
                    </>
                );
            })}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;