/**
 * Confirmation Dialog for Delete Actions
 *
 * Reusable modal dialog that prompts users to confirm deletion of an item (Nurse or Ward).
 *
 * @component
 * @param {boolean} open - Controls dialog visibility
 * @param {() => void} onClose - Callback when dialog is closed/canceled
 * @param {() => void} onConfirm - Callback when deletion is confirmed
 * @param {string} objectName - Name of the item being deleted (displayed in message)
 */
import React from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    objectName: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, onConfirm, objectName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`Are you sure you want to delete "${objectName}"?`}</DialogTitle>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
