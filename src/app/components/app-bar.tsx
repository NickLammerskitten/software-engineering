import { UserRole } from "@/src/app/models/userRole";
import { createClient } from '@/src/utils/supabase/server';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { signOutAction } from '../actions';
import styles from './app-bar.module.css';

async function ResponsiveAppBar() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pages = [
        {
            name: "Galerie",
            href: "/discover",
            role: null,
        },
        {
            name: "Meine Mappe",
            href: "/portfolio",
            role: UserRole.Customer,
        },
    ];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        className={styles.logo}
                    >
                        EinfachKunst
                    </Typography>

                    <Box className={"display-flex display-none-md flex-grow-1"}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Box className={"display-flex display-none-md flex-grow-1"}>
                        {pages.map((page) => {
                            if (user?.role !== page.role && page.role !== null) {
                                return;
                            }

                            return (
                                <Button
                                    key={page.name}
                                    href={page.href}
                                    className={styles.headerLink}
                                >
                                    {page.name}
                                </Button>
                            );
                        })}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {user ?
                            <form action={signOutAction}>
                                <Button
                                    className={styles.headerLink}
                                    type="submit"
                                >Ausloggen</Button>
                            </form>
                            :
                            <Button
                                className={styles.headerLink}
                                href="/login"
                            >
                                Einloggen
                            </Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
