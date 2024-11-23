"use client";

import {
    Box,
    Button,
    Card,
    FormControl,
    FormLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { signInAction } from "../../actions";

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(4),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    height: '100%',
    padding: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundRepeat: 'no-repeat',
    },
}));

export default function Login() {
    return (
        <>
            <SignInContainer
                direction="column"
                justifyContent="space-between"
            >
                <StyledCard variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Login
                    </Typography>
                    <form action={signInAction}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 3,
                            }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="yourname@example.com"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    sx={{ ariaLabel: 'email' }}
                                />
                            </FormControl>
                            <FormControl>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                </Box>
                                <TextField
                                    name="password"
                                    placeholder="•••••••••••"
                                    type="password"
                                    id="password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                            >
                                Anmelden
                            </Button>
                        </Box>
                    </form>
                </StyledCard>
            </SignInContainer>
        </>
    );
}
