'use client'
import {useSnackbar} from "notistack";
import {Box, Button, FormControl, FormLabel, TextField} from "@mui/material";
import * as React from "react";


export default function AddUserForm() {
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (formData: FormData) => {
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
            role: "authenticated",
            user_metadata: {
                name: formData.get("name")
            }
        }

        await fetch(`/api/user`, {
            body: JSON.stringify({formData: data}),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            console.log(response);
            if (!response.ok) {
                enqueueSnackbar(json.message, {variant: "error"});
                return;
            }

            const form = document.getElementById("add-user-form") as HTMLFormElement;
            form.reset();

            enqueueSnackbar(json.message, {variant: "success"});
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
                <FormLabel htmlFor="name">name</FormLabel>
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