"use client";

import {useEffect, useState} from "react";
import {Box, Button, Card, CircularProgress} from "@mui/material";
import styles from "./category-list.module.css";
import {Edit} from "@mui/icons-material";

export function CategoryList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
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
    }, [])

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

                            <Button startIcon={<Edit/>}
                                    href={`category/edit?id=${category.id}`}
                            >
                                Bearbeiten
                            </Button>
                        </Card>
                    ))}
                </Box>
            )}
        </div>
    )
}