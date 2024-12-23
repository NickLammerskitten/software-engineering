"use client"

import { IconButton, Paper, Tooltip } from "@mui/material";
import { useState } from "react";
import styles from "./image-card.module.css";

interface ImageCardProps {
    url: string;
    artist: string;
    title: string;
    onClick?: () => void;
    subactionIcon?: JSX.Element;
    subactionTooltip?: string;
    onSubactionClick?: () => void;
}

export function ImageCard({
    url,
    artist,
    title,
    onClick = () => { },
    subactionIcon,
    subactionTooltip,
    onSubactionClick,
}: ImageCardProps) {
    const [elevation, setElevation] = useState(1);

    return <>
        <Paper
            className={styles.image_container}
            elevation={elevation}
            onMouseEnter={() => {setElevation(4)}}
            onMouseLeave={() => {setElevation(1)}}
        >
            {onSubactionClick !== undefined &&
                <Tooltip title={subactionTooltip ?? ""}>
                    <IconButton
                        onClick={onSubactionClick}
                        className={styles.image_actions}
                    >
                        {subactionIcon}
                    </IconButton>
                </Tooltip>
            }

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                onClick={onClick}
                src={url}
                className={styles.image}
                alt="image of art"
            />
        </Paper>
        <div className={styles.subtitle_container}>
            <span><b>{title}</b></span>
            <span className={styles.artist}><i>{artist}</i></span>
        </div>
    </>;
}
