"use client"

import { Paper } from "@mui/material";
import styles from "./image-card.module.css";
import { useState } from "react";

interface ImageCardProps {
    url: string;
    artist: string;
    title: string;
    onClick?: () => void;
}

export function ImageCard({
    url,
    artist,
    title,
    onClick = () => { },
}: ImageCardProps) {

    const [elevation, setElevation] = useState(1);

    return <>
        <Paper 
            className={styles.image_container} 
            onClick={onClick} 
            elevation={elevation} 
            onMouseEnter={() => {setElevation(4)}}
            onMouseLeave={() => {setElevation(1)}}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} className={styles.image} alt="image of art"/>
        </Paper>
        <div className={styles.subtitle_container}>
            <span><b>{title}</b></span>
            <span className={styles.artist}><i>{artist}</i></span>
        </div>
    </>;
}
