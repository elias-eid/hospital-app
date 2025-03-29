import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

interface SnackbarAlertProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({ open, message, onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <MuiAlert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default SnackbarAlert;
