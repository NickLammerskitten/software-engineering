"use client"

import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

interface AddItemFormProps {
    apiPath: string;
    cancelPath: string;
}

export default function AddItemForm({ apiPath, cancelPath }: AddItemFormProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [itemNameValid, setItemNameValid] = useState<boolean>(true);
    const [itemName, setItemName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (itemName == null || itemName == "") {
            setItemNameValid(true);
            return;
        }

        const valid = nameRegEx.test(itemName);
        setItemNameValid(valid);
    }, [itemName]);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            name: formData.get("name"),
        }

        await fetch(apiPath, {
            body: JSON.stringify({ formData: data }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            if (!response.ok) {
                enqueueSnackbar(json.message, { variant: "error" });
                return;
            }

            formRef.current?.reset();
            enqueueSnackbar(json.message, { variant: "success" });
        })
    }

    return (
        <form
            className={"form_container"}
            id={"add-item-form"}
            action={(value) => handleSubmit(value)}
            ref={formRef}
        >
            <FormControl fullWidth>
                <FormLabel htmlFor="title">Name *</FormLabel>
                <TextField
                    id="name"
                    type="text"
                    name="name"
                    required
                    fullWidth
                    variant="outlined"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    helperText={itemNameValid
                        ? ""
                        : "Der Name muss zwischen 3 und 30 Zeichen lang sein und darf Zeichen von a bis z, sowie Zahlen von 0 bis 9 enthalten."}
                    error={!itemNameValid}
                />
            </FormControl>

            <Box className={"actions_container"}>
                <Button
                    variant={"text"}
                    type={"reset"}
                    href={cancelPath}
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
