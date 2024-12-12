"use client";

import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";

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
                console.log(data.data);
                setCategories(data.data);
            });
    }, [])

    return (
        <div>
            {loading && (<CircularProgress/>)}

            {!loading && categories.length > 0 && (
                <>
                    {categories.map((category) => (
                        <div>
                            {category.name}
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}