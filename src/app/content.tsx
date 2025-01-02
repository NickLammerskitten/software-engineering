"use client"

import { SnackbarProvider } from "notistack";
import React from "react";

export function Content({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SnackbarProvider>
            {children}
        </SnackbarProvider>
    );
}