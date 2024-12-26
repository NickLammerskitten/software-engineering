import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";

export const useConfirmDialog = () => {
    const [dialogState, setDialogState] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: () => { },
        onCancel: () => { },
        confirmButtonText: undefined,
        cancelButtonText: undefined,
    });

    const showConfirm = (
        title: string, 
        message: string, 
        onConfirm: () => void, 
        onCancel: () => void = () => {}, 
        confirmButtonText = undefined, 
        cancelButtonText = undefined
    ) => {
        setDialogState({ open: true, title, message, onConfirm, onCancel, confirmButtonText, cancelButtonText });
    };

    const closeConfirm = () => {
        setDialogState({ ...dialogState, open: false });
    };

    const ConfirmDialogComponent = (
        <ConfirmDialog
            open={dialogState.open}
            title={dialogState.title}
            message={dialogState.message}
            onConfirm={() => {
                dialogState.onConfirm();
                closeConfirm();
            }}
            onCancel={() => {
                dialogState.onCancel();
                closeConfirm();
            }}
            confirmButtonText={dialogState.confirmButtonText}
            cancelButtonText={dialogState.cancelButtonText}
        />
    );

    return { showConfirm, ConfirmDialogComponent };
};
