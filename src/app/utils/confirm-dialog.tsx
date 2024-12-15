import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

export function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmButtonText = "Bestätigen",
    cancelButtonText = "Abbrechen"
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
        >

            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>

            {message !== "" && 
                <DialogContent>
                    <p>{message}</p>
                </DialogContent>
            }

            <DialogActions>
                <Button onClick={onCancel}>
                    {cancelButtonText}
                </Button>
                <Button onClick={onConfirm} autoFocus variant={"contained"}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
            
        </Dialog>
    );
}
