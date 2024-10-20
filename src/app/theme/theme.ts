'use client';

import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
    cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
        cssVarPrefix: 'template',
    }
});

export default theme;