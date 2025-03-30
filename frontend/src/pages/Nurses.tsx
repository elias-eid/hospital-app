import React, {useState, useEffect} from 'react';
import NurseTable from '../components/nursetable/NurseTable';
import NurseForm from '../components/nurseform/NurseForm';
import DeleteDialog from '../components/deletedialog/DeleteDialog';
import SnackbarAlert from '../components/snackbaralert/SnackbarAlert';
import {Box, CircularProgress, Dialog, DialogTitle, Fab, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {Nurse, Ward} from '../types';

const Nurses: React.FC = () => {
    const [nurses, setNurses] = useState<Nurse[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nurseResponse, wardResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/nurses'),
                    fetch('http://localhost:5000/api/wards')
                ]);
                const nurseData: Nurse[] = await nurseResponse.json();
                const wardData: Ward[] = await wardResponse.json();
                setNurses(nurseData);
                setWards(wardData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Function used to open create/edit dialog
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

    // Function to close create/edit and delete dialogs
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

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Function to handle saving a nurse (w/ validation)
    const handleSaveNurse = async () => {
        // Validation to ensure that first name, last
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

            const data = await response.json();
            if (response.ok) {
                setNurses((prevNurses) =>
                    isEdit
                        ? prevNurses.map((nurse) => (nurse.id === selectedNurse?.id ? {...nurse, ...data} : nurse))
                        : [...prevNurses, data]
                );
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

    // Function to delete a nurse
    const handleDeleteNurse = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/nurses/${id}`, {method: 'DELETE'});
            if (response.ok) {
                setNurses((prevNurses) => prevNurses.filter((nurse) => nurse.id !== id));
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
                    { /* FAB positioned in the bottom right corner to create new nurses */}
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
                    onCancel: handleClose,
                    wards
                }} />
            </Dialog>
            <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}
                          onConfirm={() => handleDeleteNurse(deleteNurseId!)} objectName={deleteNurseName}/>
            <SnackbarAlert open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)}/>
        </div>
    );
};

export default Nurses;
