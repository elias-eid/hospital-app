import React from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    DialogActions,
    DialogContent,
    Typography,
    Box
} from '@mui/material';
import { Ward } from '../../types';

interface NurseFormProps {
    firstName: string;
    setFirstName: (name: string) => void;
    lastName: string;
    setLastName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    wardId: number | "";
    setWardId: (id: number | "") => void;
    wards: Ward[];
    errorFirstName: string | null;
    errorLastName: string | null;
    errorEmail: string | null;
    errorWard: string | null;
    onSave: () => void;
    onCancel: () => void;
}

const NurseForm: React.FC<NurseFormProps> = ({
                                                 firstName,
                                                 setFirstName,
                                                 lastName,
                                                 setLastName,
                                                 email,
                                                 setEmail,
                                                 wardId,
                                                 setWardId,
                                                 wards,
                                                 errorFirstName,
                                                 errorLastName,
                                                 errorEmail,
                                                 errorWard,
                                                 onSave,
                                                 onCancel
                                             }) => {
    return (
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errorFirstName}
                helperText={errorFirstName}
            />
            <TextField
                margin="dense"
                label="Last Name"
                fullWidth
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errorLastName}
                helperText={errorLastName}
            />
            <TextField
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errorEmail}
                helperText={errorEmail}
            />
            <FormControl fullWidth margin="normal" error={!!errorWard}>
                <InputLabel>Ward</InputLabel>
                <Select
                    value={wardId}
                    onChange={(e) => setWardId(e.target.value === "" ? "" : Number(e.target.value))}
                    label="Ward"
                    renderValue={(selected) => {
                        const selectedWard = wards.find(w => w.id === selected);
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {selectedWard && (
                                    <>
                                        <div style={{
                                            backgroundColor: selectedWard.color,
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '1px solid #ddd'
                                        }} />
                                        <span>{selectedWard.name}</span>
                                    </>
                                )}
                            </Box>
                        );
                    }}
                >
                    {wards.map((ward) => (
                        <MenuItem key={ward.id} value={ward.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <div style={{
                                    backgroundColor: ward.color,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: '1px solid #ddd'
                                }} />
                                <span>{ward.name}</span>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
                {errorWard && <Typography variant="body2" color="error">{errorWard}</Typography>}
            </FormControl>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </DialogContent>
    );
};

export default NurseForm;