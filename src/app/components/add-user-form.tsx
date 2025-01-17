'use client'
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";

export default function AddUserForm() {
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (formData: FormData) => {
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
            role: "authenticated",
            user_metadata: {
                name: formData.get("name"),
            },
        }

        await fetch(`/api/user`, {
            body: JSON.stringify({ formData: data }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const userJson = await response.json();

            if (!response.ok) {
                enqueueSnackbar(userJson.message, { variant: "error" });
                return;
            }

            enqueueSnackbar(userJson.message, { variant: "success" });
            return userJson;
        }).then(async (userJson) => {
            await fetch('/api/portfolio', {
                body: JSON.stringify({
                    formData: {
                        name: "Portfolio von " + data.user_metadata.name ? data.user_metadata.name : data.email,
                        description: null,
                        owner_id: userJson.data.id,
                    },
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async (response) => {
                const portfolioJson = await response.json();

                if (!response.ok) {
                    enqueueSnackbar(portfolioJson.message, { variant: "error" });
                    return;
                }

                enqueueSnackbar(portfolioJson.message, { variant: "success" });
            })
        });
    }

    return (
        <form
            className={"form_container"}
            id={"add-user-form"}
            action={(value) => handleSubmit(value)}
        >
            <FormControl>
                <FormLabel htmlFor="email">Email *</FormLabel>
                <TextField
                    id="email"
                    type="text"
                    name="email"
                    required
                    fullWidth
                    variant="outlined"
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="password">Password *</FormLabel>
                <TextField
                    id="password"
                    type="text"
                    name="password"
                    fullWidth
                    variant="outlined"
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <TextField
                    id="name"
                    type="text"
                    name="name"
                    required
                    fullWidth
                    variant="outlined"
                />
            </FormControl>
            <Box className={"actions_container"}>
                <Button
                    variant={"text"}
                    type={"reset"}
                    href="/settings/user"
                >
                    Abbrechen
                </Button>
                <Button
                    variant={"contained"}
                    type={"submit"}
                >
                    Speichern
                </Button>
            </Box>
        </form>
    )
}