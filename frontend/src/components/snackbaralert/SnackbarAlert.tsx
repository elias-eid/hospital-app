/**
 * Reusable Success Notification Component
 *
 * Displays temporary success messages in an MUI Snackbar with:
 * - Auto-hide after 6 seconds
 * - Close button functionality
 *
 * @component
 * @param {boolean} open - Controls visibility of the snackbar
 * @param {string} message - Notification message content
 * @param {() => void} onClose - Callback when snackbar closes
 *
 */

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
