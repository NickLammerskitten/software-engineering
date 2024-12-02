import { UserRole } from "@/src/app/models/userRole";
import { createClient } from '@/src/utils/supabase/server';
import { AppBar as MUIAppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { User } from "@supabase/auth-js";
import * as React from 'react';
import { signOutAction } from '../actions';
import styles from './app-bar.module.css';

interface PageProps {
    name: string;
    href: string;
    role: UserRole | null;
}

async function AppBar() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pages: PageProps[] = [
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

    const secondaryPages: PageProps[] = [
        {
            name: "Bilder",
            href: "/images",
            role: UserRole.Trader,
        },
    ];

    return (
        <MUIAppBar position="static">
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
                    <Box className={styles.pages_container}>
                        {pageElements({ pages: pages, user: user })}
                    </Box>

                    <Box className={styles.secondary_pages_container}>
                        {pageElements({ pages: secondaryPages, user: user })}

                        {user ?
                            <form action={signOutAction}>
                                <Button
                                    className={styles.header_link}
                                    type="submit"
                                >
                                    Ausloggen
                                </Button>
                            </form>
                            :
                            <Button
                                className={styles.header_link}
                                href="/login"
                            >
                                Einloggen
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </MUIAppBar>
    );
}

function pageElements({ pages, user }: { pages: PageProps[], user: User | null }) {
    return (
        <>
            {pages.map((page) => {
                if (user?.role !== page.role && page.role !== null) {
                    return;
                }

                return (
                    <Button
                        key={page.name}
                        href={page.href}
                        className={styles.header_link}
                    >
                        {page.name}
                    </Button>
                );
            })}
        </>
    )
}

export default AppBar;
