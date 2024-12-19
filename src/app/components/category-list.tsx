"use client";

import { Fragment, useEffect, useState } from "react";
import { Alert, Box, Card, CircularProgress, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmDialog } from "../utils/confirm-dialog-hook";

export function CategoryList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [errorMessages, setErrorMessages] = useState<{ [id: number]: string }>({});
    const [categoryListError, setCategoryListError] = useState<string>("");
    const {showConfirm, ConfirmDialogComponent} = useConfirmDialog();

    useEffect(() => {
        setErrorMessages({});
        setCategoryListError("");
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);

        const response = await fetch(`/api/category`);

        const json = await response.json();

        if (!response.ok) {
            setCategoryListError(`Error while fetching categories (${response.status}): ${json["message"]}`);
            return;
        }

        setLoading(false);
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

        if (!response.ok) {
            errorMessages[id] = `Error ${response.status}: ${json["message"]}`;
            setErrorMessages({ ...errorMessages });
            return;
        }

        if (!json["success"]) {
            errorMessages[id] = `Unexpected error when deleting category`;
            setErrorMessages({ ...errorMessages });
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
                            {errorMessages[category.id] &&
                                <Alert severity="error">
                                    {errorMessages[category.id]}
                                </Alert>
                            }
                        </Fragment>
                    ))}
                </Box>
            )}

            {categoryListError !== "" && 
            <Alert severity="error">
                {categoryListError}
            </Alert>
            }

            {ConfirmDialogComponent}
        </div>
    )
}