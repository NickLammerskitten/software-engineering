"use client";

import { useSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import { Box, Card, CircularProgress, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmDialog } from "../utils/confirm-dialog-hook";

interface ItemListProps {
    apiPath: string;
    editPath: string;
}

export function ItemList({ apiPath, editPath }: ItemListProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<Category[]>([]);
    const {showConfirm, ConfirmDialogComponent} = useConfirmDialog();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);

        const response = await fetch(apiPath);

        const json = await response.json();

        setLoading(false);

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        setItems(json["data"]);
    };

    const deleteItem = async (id: number) => {
        const response = await fetch(`${apiPath}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const json = await response.json();

        if (!response.ok || !json["success"]) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        await fetchItems();
    };

    const handleDelete = (id: number) => {
        showConfirm(
            "Möchtest du dieses Element wirklich löschen?",
            "",
            () => {
                deleteItem(id);
            }
        );
    };

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && items.length > 0 && (
                <Box className={"items_list"}>
                    {items.map((item) => (
                        <Fragment key={item.id}>
                            <Card key={item.id}
                                className={"item"}
                            >
                                {item.name}

                                <Box>
                                    <IconButton href={`${editPath}?id=${item.id}`}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item.id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Fragment>
                    ))}
                </Box>
            )}

            {ConfirmDialogComponent}
        </div>
    )
}
