"use client";

import ConfirmDialog from "@/src/app/utils/confirm-dialog";
import { Edit } from "@mui/icons-material";
import { Box, Card, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./category-list.module.css";

export function CategoryList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        setLoading(true);
        fetch(`/api/category`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error fetching categories");
                }

                return res.json();
            })
            .then((data: { data: Category[] }) => {
                setLoading(false);
                setCategories(data.data);
            });
    }

    const handleDelete = (id: number): Promise<void> => {
        return fetch(`/api/category/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async res => {
            if (!res.ok) {
                throw new Error(await res.text());
            }

            fetchCategories();
        });
    }

    return (
        <div>
            {loading && (<CircularProgress />)}

            {!loading && categories.length > 0 && (
                <Box className={styles.category_list}>
                    {categories.map((category) => (
                        <Card
                            key={category.id}
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
                    ))}
                </Box>
            )}
        </div>
    )
}