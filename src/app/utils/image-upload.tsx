import styles from "@/src/app/components/add-image-form.module.css";
import { toBase64 } from "@/src/app/utils/file-to-base64";
import { Close, Upload } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, FormControl, FormLabel, IconButton, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

interface ImageUploadProps {
    setImageUrl: (url: string | undefined) => void;
}

export function ImageUpload({ setImageUrl }: ImageUploadProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUploading(false);
        setUploadSuccess(undefined);
        setImageUrl(undefined);
    }, [imageFile, setImageFile, setImageUrl]);

    const handleRemoveImage = () => {
        setImageUrl(undefined);
        setImageFile(null);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // setImageFile(event.target.files?.item(0) ?? null)
        if (event.target.files?.length === 0 || event.target.files?.length === undefined) {
            return;
        }

        if (event.target.files?.length > 1) {
            // maybe some error that not more than one file should be selected?
            return;
        }

        const image = event.target.files.item(0);
        
        if (!image) {
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", image);

        const base64Data = await toBase64(image);

        const response = await fetch(`/api/gallery/file`, {
            method: "POST",
            body: JSON.stringify({
                file: {
                    title: image.name,
                    data: base64Data,
                    contentType: image.type,
                },
            }),
        });

        if (!response.ok) {
            if (response.status === 409) {
                setUploadSuccess(true);
                setUploading(false);
            } else {
                setUploadSuccess(false);
                setUploading(false);
                return;
            }
        }

        const data = await response.json();
        setImageUrl(data.path);
        setUploadSuccess(true);
        setUploading(false);
        setImageFile(image);
    };

    return (
        <FormControl>
            <FormLabel htmlFor="imageFile">Bild</FormLabel>
            <Box>
                <input
                    ref={inputRef}
                    type={"file"}
                    accept={"image/*"}
                    id={"imageFile"}
                    name={"imageFile"}
                    style={{ visibility: "hidden", position: "absolute" }}
                    onChange={handleImageChange}
                />
            </Box>

            {uploadSuccess === true && <Alert severity="success">Bild erfolgreich hochgeladen!</Alert>}
            {uploadSuccess === false && <Alert severity="error">Fehler beim Hochladen des Bildes!</Alert>}

            <Box className={styles.image_preview} style={{borderStyle: imageFile ? "" : "dashed"}}>
                {imageFile ? (
                    <>
                        <Tooltip title="Bild entfernen">
                            <IconButton style={{ position: "absolute", right: "0", margin: "5px 5px 0 0" }} onClick={handleRemoveImage}><Close /></IconButton>
                        </Tooltip>
                        <img
                            style={{ maxWidth: "100%" }}
                            src={URL.createObjectURL(imageFile)}
                            alt={"Preview"}
                        />
                    </>
                ) :
                    (
                        <div style={{height: "100px", display: "flex", alignItems: "center"}}>
                            {!uploading ? (
                                <Button startIcon={<Upload />} onClick={() => {
                                    inputRef.current?.click();
                                }}>
                                    Bild hochladen
                                </Button>
                            ) : (
                                <CircularProgress />
                            )}
                        </div>
                    )}
            </Box>
        </FormControl>
    )
}
