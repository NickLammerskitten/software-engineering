import { Delete } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import React, { JSX } from "react";

interface ConfirmDialogProps {
    onConfirm: () => Promise<void>;
    title?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: JSX.Element;
}

export default function ConfirmDialog({
    onConfirm,
    title = "Möchtest du diese Aktion wirklich ausführen?",
    confirmButtonText = "Bestätigen",
    cancelButtonText = "Abbrechen",
    icon = <Delete/>
}: ConfirmDialogProps) {
    const [open, setOpen] = React.useState(false);

    const onClose = () => {
        setOpen(false);
    }

    const handleConfirm = () => {
        onConfirm().then(() => {
            setOpen(false);
        });
    }

    return (
        <React.Fragment>
            <IconButton onClick={() => setOpen(true)}>
                {icon}
            </IconButton>

            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="confirm-dialog-title"
            >
                <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
                <DialogActions>
                    <Button onClick={onClose}>{cancelButtonText}</Button>
                    <Button
                        onClick={handleConfirm}
                        autoFocus
                    >
                        {confirmButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}