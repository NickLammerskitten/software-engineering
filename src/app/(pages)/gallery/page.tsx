"use client"

import {UserRole} from "@/src/app/models/user-role";
import {Add} from "@mui/icons-material";
import {Button, CircularProgress, Grid2, Typography} from "@mui/material";
import { ImageCard } from "../../components/image-card";
import { ImageResponseData } from "../../api/models/image.model";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/src/utils/supabase/client";
import { useRouter } from "next/navigation";

const fallbackImageUrl = "images/no-photo.jpg";

export default function Gallery() {
    const [user, setUser] = useState<User | null>(null);
    const [images, setImages] = useState<ImageResponseData[]>([]);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
    
        supabase.auth.getUser().then(v => {
            setUser(v.data.user);
        });

        setLoadingError(null);
    }, []);

    const loadImages = async () => {
        const response = await fetch("api/image", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const json = await response.json();

        if (!response.ok) {
            setLoadingError(json["message"]);
            return;
        }

        setImages(json["data"]);
    };

    useEffect(() => {
        loadImages();
    }, [user]);

    return loadingError ? <div>{loadingError}</div> : !user ? <CircularProgress /> : (
        <div>
            <Typography variant={"h1"}>
                Galerie
            </Typography>

            {user?.role === UserRole.Trader && (
                <Button startIcon={<Add/>}
                        href="/image/add"
                        className={"top_action_buttons"}
                >
                    Bild hinzufügen
                </Button>
            )}

            <Grid2
                container
                spacing={3}
            >
                {images.map((image, index) => {
                    return <Grid2 key={index} size={3} minWidth={250}>
                        <ImageCard 
                            url={image.image_url ?? fallbackImageUrl} 
                            artist={image.artist} 
                            title={image.title}
                            onClick={() => {
                                router.push(`/image/${image.id}`)
                            }}
                        />
                    </Grid2>;
                })}
            </Grid2>
        </div>
    );
}
