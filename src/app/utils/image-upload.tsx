import styles from "@/src/app/components/add-image-form.module.css";
import { ToBase64 } from "@/src/app/utils/file-to-base64";
import { Alert, Box, Button, CircularProgress, FormControl, FormLabel } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from "react";

interface ImageUploadProps {
    imageUrl: string | undefined;
    setImageUrl: (url: string | undefined) => void;
}

export function ImageUpload({ imageUrl, setImageUrl }: ImageUploadProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setUploading(false);
        setUploadSuccess(undefined);
        setImageUrl(undefined);
    }, [imageFile]);

    const handleUpload = async () => {
        if (!imageFile) {
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const base64Data = await ToBase64(imageFile);

        const response = await fetch(`/api/gallery/file`, {
            method: "POST",
            body: JSON.stringify({
                file: {
                    title: imageFile.name,
                    data: base64Data,
                    contentType: imageFile.type,
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
    }

    return (
        <FormControl>
            <FormLabel htmlFor="imageFile">Bild</FormLabel>
            <Box>
                <input
                    type={"file"}
                    accept={"image/*"}
                    id={"imageFile"}
                    name={"imageFile"}
                    onChange={(event) => setImageFile(event.target.files?.item(0) ?? null)}
                />

                <Button
                    variant={"text"}
                    onClick={handleUpload}
                    component={"span"}
                    disabled={uploadSuccess === true || uploading}
                >
                    Hochladen
                </Button>
            </Box>

            {uploading && <CircularProgress />}

            {uploadSuccess === true && <Alert severity="success">Bild erfolgreich hochgeladen!</Alert>}
            {uploadSuccess === false && <Alert severity="error">Fehler beim Hochladen des Bildes!</Alert>}

            {imageFile ? (
                <Box className={styles.image_preview}>
                    <img
                        height={'100px'}
                        width={'100px'}
                        src={URL.createObjectURL(imageFile)}
                        alt={"Preview"}
                    />
                </Box>
            ) : (
                <Box>
                    <Alert severity="info">Kein Bild ausgewählt</Alert>
                </Box>
            )}
        </FormControl>
    )
}