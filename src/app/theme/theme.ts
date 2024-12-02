"use client"

import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        h1: {
            fontSize: "2.986rem",
            fontWeight: 500
        },
        h2: {
            fontSize: "2.488rem",
            fontWeight: 500
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400
        }
    },
    palette: {
        mode: "dark",
    },
});

export default theme;
