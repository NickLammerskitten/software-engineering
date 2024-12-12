"use client";

import {useEffect, useState} from "react";
import {Box, Card, CircularProgress, IconButton} from "@mui/material";
import styles from "./category-list.module.css";
import {Delete, Edit} from "@mui/icons-material";

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

    const handleDelete = (id: number) => {
        fetch(`/api/category/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.text())
            .then((message: string | { success: boolean }) => {
                if (typeof message === "string") {
                    throw new Error(message);
                }

                fetchCategories();
            })
    }

    return (
        <div>
            {loading && (<CircularProgress/>)}

            {!loading && categories.length > 0 && (
                <Box className={styles.category_list}>
                    {categories.map((category) => (
                        <Card key={category.id}
                              className={styles.category_list_item}
                        >
                            {category.name}

                            <Box>
                                <IconButton href={`category/edit?id=${category.id}`}>
                                    <Edit/>
                                </IconButton>
                                <IconButton onClick={() => handleDelete(category.id)}>
                                    <Delete/>
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
        </div>
    )
}