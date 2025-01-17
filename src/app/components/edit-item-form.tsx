"use client"

import { Box, Button, CircularProgress, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

const nameRegEx = new RegExp('^[\u00C0-\u017Fa-zA-Z0-9 ]{3,30}$')

interface EditItemFormProps {
    apiPath: string;
    cancelPath: string;
}

export function EditItemForm({ apiPath, cancelPath }: EditItemFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [itemId, setItemId] = useState<number | null>(null);
    const [itemName, setItemName] = useState<string | null>(null)
    const [itemNameValid, setItemNameValid] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true);

        const itemId = searchParams.get('id') as number | null;
        setItemId(itemId);

        if (itemId == null) {
            setLoading(false);
            setItemName(null);
            return;
        }

        fetch(`${apiPath}/${itemId}`)
            .then((res) => {
                if (!res.ok) {
                    setLoading(false);
                    throw new Error("Error fetching item");
                }

                return res.json();
            })
            .then((data: { data: {name: string} }) => {
                setLoading(false);
                setItemName(data.data.name);
            });
    }, [searchParams]);

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
            id: itemId,
            name: formData.get("name"),
        }

        await fetch(apiPath, {
            body: JSON.stringify({ formData: data }),
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            if (!response.ok) {
                enqueueSnackbar(json.message, { variant: "error" });
                return;
            }

            const form = document.getElementById("edit-item-form") as HTMLFormElement;
            form.reset();

            enqueueSnackbar(json.message, { variant: "success" });
        })
    }

    return (
        <>
            {loading ? (<CircularProgress />)
                : itemName !== null ? (
                    <form
                        className={"form_container"}
                        id={"edit-item-form"}
                        action={(value) => handleSubmit(value)}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Name *</FormLabel>
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
                ) : (
                    <Typography variant={"body1"}>
                        Es ist ein unerwarteter Fehler aufgetreten.
                    </Typography>
                )}
        </>
    )
}