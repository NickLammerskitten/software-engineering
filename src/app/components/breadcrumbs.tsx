'use client';
import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const pathnames = pathname.split("/").filter((x) => x);

    if (pathnames.length <= 1) {
        return null;
    }

    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <Typography key={to} color="text.primary">
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Typography>
                ) : (
                    <Link
                        key={to}
                        href={to.includes("/image") ? "/gallery" : to}
                        underline="hover"
                        color="inherit"
                    >
                        {to.includes("/image") ? "Gallery" : value.charAt(0).toUpperCase() + value.slice(1)}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;