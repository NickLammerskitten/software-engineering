"use client";

import { useSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import { Box, Card, CircularProgress, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmDialog } from "../utils/confirm-dialog-hook";

export function CategoryList() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const {showConfirm, ConfirmDialogComponent} = useConfirmDialog();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);

        const response = await fetch(`/api/category`);

        const json = await response.json();

        setLoading(false);

        if (!response.ok) {
            enqueueSnackbar(json.message, { variant: "error" });
            return;
        }

        setCategories(json["data"]);
    };

    const deleteCategory = async (id: number) => {
        const response = await fetch(`/api/category/${id}`, {
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

        await fetchCategories();
    };

    const handleDelete = (id: number) => {
        showConfirm(
            "Möchtest du diese Kategorie wirklich löschen?",
            "",
            () => {
                deleteCategory(id);
            }
        );
    };

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && categories.length > 0 && (
                <Box className={"items_list"}>
                    {categories.map((category) => (
                        <Fragment key={category.id}>
                            <Card key={category.id}
                                className={"item"}
                            >
                                {category.name}

                                <Box>
                                    <IconButton href={`category/edit?id=${category.id}`}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(category.id)}>
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