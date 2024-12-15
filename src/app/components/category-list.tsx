"use client";

import ConfirmDialog from "@/src/app/utils/confirm-dialog";
import { useEffect, useState } from "react";
import { Alert, Box, Card, CircularProgress, IconButton } from "@mui/material";
import styles from "./category-list.module.css";
import { Edit } from "@mui/icons-material";

export function CategoryList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [errorMessages, setErrorMessages] = useState<{ [id: number]: string }>({});
    const [categoryListError, setCategoryListError] = useState<string>("");

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

    const handleDelete = async (id: number) => {
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

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && categories.length > 0 && (
                <Box className={styles.category_list}>
                    {categories.map((category) => (
                        <>
                            <Card key={category.id}
                                className={styles.category_list_item}
                            >
                                {category.name}

                                <Box>
                                    <IconButton href={`category/edit?id=${category.id}`}>
                                        <Edit />
                                    </IconButton>
                                    <ConfirmDialog onConfirm={() => handleDelete(category.id)} />
                                </Box>
                            </Card>
                            {errorMessages[category.id] &&
                                <Alert severity="error">
                                    {errorMessages[category.id]}
                                </Alert>
                            }
                        </>
                    ))}
                </Box>
            )}

            {categoryListError !== "" && 
            <Alert severity="error">
                {categoryListError}
            </Alert>
            }
        </div>
    )
}