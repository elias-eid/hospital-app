/**
 * Nurses Page Component
 *
 * Displays a paginated list of nurse records with options to create, edit or delete nurses.
 *
 * @component
 * @param {Nurse[]} nurses - Array of nurse objects to be displayed in a table
 * @param {boolean} loading - A flag indicating if the data is still being loaded
 * @param {() => Promise<void>} refreshNurses - Callback function to refresh the nurse data
 *
 * @returns {JSX.Element} Nurses page with nurse management features
 */

import React, { useState } from 'react';
import NurseTable from '../components/nursetable/NurseTable';
import NurseForm from '../components/nurseform/NurseForm';
import DeleteDialog from '../components/deletedialog/DeleteDialog';
import SnackbarAlert from '../components/snackbaralert/SnackbarAlert';
import {Box, CircularProgress, Dialog, DialogTitle, Fab, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../contexts/AppContext';
import { Nurse } from '../types';

const Nurses: React.FC = () => {
    const { nurses, loading, refreshNurses} = useApp();
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [wardId, setWardId] = useState<number | "">("");
    const [errorFirstName, setErrorFirstName] = useState<string | null>(null);
    const [errorLastName, setErrorLastName] = useState<string | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);
    const [errorWard, setErrorWard] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteNurseId, setDeleteNurseId] = useState<number | null>(null);
    const [deleteNurseName, setDeleteNurseName] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleOpen = (nurse?: Nurse) => {
        if (nurse) {
            setIsEdit(true);
            setSelectedNurse(nurse);
            setFirstName(nurse.first_name);
            setLastName(nurse.last_name);
            setEmail(nurse.email);
            setWardId(nurse.ward_id);
        } else {
            setIsEdit(false);
            setFirstName('');
            setLastName('');
            setEmail('');
            setWardId('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedNurse(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setWardId('');
        setErrorFirstName(null);
        setErrorLastName(null);
        setErrorEmail(null);
        setErrorWard(null);
    };

    // Check if email address is valid
    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Check if the email address is unique
    const checkEmailUniqueness = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`http://localhost:5000/api/nurses/check-email?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const data = await response.json();
                return data.exists;  // Return true if email exists
            }
            return false;  // False otherwise
        } catch (error) {
            console.error('Error checking email uniqueness', error);
            return false;
        }
    };

    // Function to handle saving a nurse with proper validation
    const handleSaveNurse = async () => {
        let isValid = true;
        if (!firstName) {
            setErrorFirstName('First name cannot be empty');
            isValid = false;
        } else {
            setErrorFirstName(null);
        }
        if (!lastName) {
            setErrorLastName('Last name cannot be empty');
            isValid = false;
        } else {
            setErrorLastName(null);
        }
        if (!email) {
            setErrorEmail('Email cannot be empty');
            isValid = false;
        } else if (!validateEmail(email)) {
            setErrorEmail('Please enter a valid email address');
            isValid = false;
        } else {
            setErrorEmail(null);
        }
        if (!wardId) {
            setErrorWard('Ward is required');
            isValid = false;
        } else {
            setErrorWard(null);
        }

        if (!isValid) return;

        // Check if email is unique before saving
        const emailExists = await checkEmailUniqueness(email);
        if (emailExists) {
            setErrorEmail('Email is already in use');
            return;
        }

        const newNurse = {
            firstName,
            lastName,
            email,
            wardId
        };
        try {
            const response = isEdit
                ? await fetch(`http://localhost:5000/api/nurses/${selectedNurse?.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newNurse),
                })
                : await fetch('http://localhost:5000/api/nurses', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newNurse),
                });

            if (response.ok) {
                await refreshNurses();
                handleClose();
                setSnackbarMessage(isEdit ? 'Nurse updated successfully' : 'Nurse created successfully');
                setSnackbarOpen(true);
            } else {
                setErrorFirstName('Error saving nurse');
            }
        } catch (error) {
            console.error(error);
            setErrorFirstName('Error saving nurse');
        }
    };

    // Function used to delete a nurse
    const handleDeleteNurse = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/nurses/${id}`, {method: 'DELETE'});
            if (response.ok) {
                await refreshNurses();
                setDeleteDialogOpen(false);
                setSnackbarMessage('Nurse deleted successfully');
                setSnackbarOpen(true);
            } else {
                console.error('Failed to delete nurse');
            }
        } catch (error) {
            console.error('Error deleting nurse:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Nurses</Typography>
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress size={80}/>
                </Box>
            ) : (
                <>
                    <NurseTable nurses={nurses} onEdit={handleOpen} onDelete={(id: number, name: string) => {
                        setDeleteNurseId(id);
                        setDeleteNurseName(name);
                        setDeleteDialogOpen(true);
                    }}/>
                    <Box sx={{position: 'relative', height: '15vh', maxWidth: '1800px', margin: '0 auto'}}>
                        <Fab color="primary" aria-label="create new nurse" onClick={() => handleOpen()}
                             style={{position: 'absolute', bottom: '20px', right: '0px'}}>
                            <AddIcon/>
                        </Fab>
                    </Box>
                </>
            )}
            <Dialog open={open} onClose={handleClose} sx={{'& .MuiDialog-paper': {width: '400px'}}}>
                <DialogTitle>{isEdit ? 'Edit Nurse' : 'Create New Nurse'}</DialogTitle>
                <NurseForm {...{
                    firstName,
                    setFirstName,
                    lastName,
                    setLastName,
                    email,
                    setEmail,
                    wardId,
                    setWardId,
                    errorFirstName,
                    errorLastName,
                    errorEmail,
                    errorWard,
                    onSave: handleSaveNurse,
                    onCancel: handleClose
                }} />
            </Dialog>
            <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}
                          onConfirm={() => handleDeleteNurse(deleteNurseId!)} objectName={deleteNurseName}/>
            <SnackbarAlert open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)}/>
        </div>
    );
};

export default Nurses;