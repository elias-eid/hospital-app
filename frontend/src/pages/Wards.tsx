import React, {useState, useEffect} from 'react';
import WardTable from '../components/wardtable/WardTable';
import WardForm from '../components/wardform/WardForm';
import DeleteDialog from '../components/deletedialog/DeleteDialog';
import SnackbarAlert from '../components/snackbaralert/SnackbarAlert';
import {Box, CircularProgress, Dialog, DialogTitle, Fab, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {Ward} from '../types';

const Wards: React.FC = () => {
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [wardName, setWardName] = useState('');
    const [color, setColor] = useState('');
    const [errorName, setErrorName] = useState<string | null>(null);
    const [errorColor, setErrorColor] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteWardId, setDeleteWardId] = useState<number | null>(null);
    const [deleteWardName, setDeleteWardName] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchWards = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/wards');
                const data: Ward[] = await response.json();
                setWards(data);
            } catch (error) {
                console.error('Error fetching wards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWards();
    }, []);

    const handleOpen = (ward?: Ward) => {
        if (ward) {
            setIsEdit(true);
            setSelectedWard(ward);
            setWardName(ward.name);
            setColor(ward.color);
        } else {
            setIsEdit(false);
            setWardName('');
            setColor('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWard(null);
        setWardName('');
        setColor('');
        setErrorName(null);
        setErrorColor(null);
    };

    const handleSaveWard = async () => {
        // Validation to ensure that the ward name and color are not empty
        let isValid = true;

        if (!wardName) {
            setErrorName('Ward name cannot be empty');
            isValid = false;
        } else {
            setErrorName(null);
        }

        if (!color) {
            setErrorColor('Color must be selected');
            isValid = false;
        } else {
            setErrorColor(null);
        }

        if (!isValid) {
            return;
        }

        const newWard = {name: wardName, color};
        try {
            const response = isEdit
                ? await fetch(`http://localhost:5000/api/wards/${selectedWard?.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newWard),
                })
                : await fetch('http://localhost:5000/api/wards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newWard),
                });

            const data = await response.json();
            if (response.ok) {
                setWards((prevWards) => {
                    if (isEdit) {
                        return prevWards.map((ward) =>
                            ward.id === selectedWard?.id ? {...ward, ...data} : ward
                        );
                    } else {
                        return [...prevWards, data];
                    }
                });
                handleClose();
                setSnackbarMessage(isEdit ? 'Ward updated successfully' : 'Ward created successfully');
                setSnackbarOpen(true);
            } else {
                setErrorName('Error saving ward');
            }
        } catch (error) {
            console.error(error);
            setErrorName('Error saving ward');
        }
    };

    const handleDeleteWard = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/wards/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setWards((prevWards) => prevWards.filter((ward) => ward.id !== id));
                setDeleteDialogOpen(false);
                setSnackbarMessage('Ward deleted successfully');
                setSnackbarOpen(true);
            } else {
                console.error('Failed to delete ward');
            }
        } catch (error) {
            console.error('Error deleting ward:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Wards</Typography>
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress size={80}/> {/* Adjust the size here */}
                </Box>
            ) : (
                <>
                    <WardTable
                        wards={wards}
                        onEdit={handleOpen}
                        onDelete={(id: number, name: string) => {
                            setDeleteWardId(id);
                            setDeleteWardName(name);
                            setDeleteDialogOpen(true);
                        }}
                    />

                    <Box
                        sx={{
                            height: '15vh',
                            maxWidth: '1800px',
                            margin: '0 auto',
                            position: 'relative'
                        }}
                    >
                        { /* FAB positioned in the bottom right corner to create new wards */}
                        <Fab
                            color="primary"
                            aria-label="create new ward"
                            onClick={() => handleOpen()}
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '0px'
                            }}
                        >
                            <AddIcon/>
                        </Fab>
                    </Box>
                </>
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '400px',
                    }
                }}
            >
                <DialogTitle>{isEdit ? 'Edit Ward' : 'Create New Ward'}</DialogTitle>
                <WardForm
                    wardName={wardName}
                    setWardName={setWardName}
                    color={color}
                    setColor={setColor}
                    errorName={errorName}
                    errorColor={errorColor}
                    onSave={handleSaveWard}
                    onCancel={handleClose}
                />
            </Dialog>

            <DeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => handleDeleteWard(deleteWardId!)}
                objectName={deleteWardName}
            />

            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={() => setSnackbarOpen(false)}
            />
        </div>
    );
};

export default Wards;
