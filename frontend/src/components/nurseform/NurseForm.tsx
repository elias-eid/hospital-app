/**
 * Nurse Form Component
 *
 * A reusable form dialog for creating/editing nurse records with:
 * - First name, last name, and email fields
 * - Ward selection with visual color indicators
 * - Form validation and error display
 * - Cancel/Save actions
 *
 * @component
 * @param {string} firstName - Current first name value
 * @param {Function} setFirstName - First name setter function
 * @param {string} lastName - Current last name value
 * @param {Function} setLastName - Last name setter function
 * @param {string} email - Current email value
 * @param {Function} setEmail - Email setter function
 * @param {number|""} wardId - Currently selected ward ID
 * @param {Function} setWardId - Ward ID setter function
 * @param {Ward[]} wards - Array of ward options for selection
 * @param {string|null} errorFirstName - First name validation error
 * @param {string|null} errorLastName - Last name validation error
 * @param {string|null} errorEmail - Email validation error
 * @param {string|null} errorWard - Ward selection validation error
 * @param {Function} onSave - Save button handler
 * @param {Function} onCancel - Cancel button handler
 *
 */

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
    Box,
    Tooltip
} from '@mui/material';
import {useApp} from "../../contexts/AppContext";

interface NurseFormProps {
    firstName: string;
    setFirstName: (name: string) => void;
    lastName: string;
    setLastName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    wardId: number | "";
    setWardId: (id: number | "") => void;
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
                                                 errorFirstName,
                                                 errorLastName,
                                                 errorEmail,
                                                 errorWard,
                                                 onSave,
                                                 onCancel
                                             }) => {

    const { wards, loading } = useApp(); // Get wards from AppContext

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
                <InputLabel>Ward {loading && '(Loading...)'}</InputLabel>
                <Select
                    value={wardId}
                    onChange={(e) => setWardId(e.target.value === "" ? "" : Number(e.target.value))}
                    label="Ward"
                    renderValue={(selected) => {
                        const selectedWard = wards.find(w => w.id === selected);
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {selectedWard && (
                                    <Tooltip title={selectedWard.color} arrow placement="top" slotProps={{
                                        tooltip: {
                                            sx: {
                                                backgroundColor: 'common.black',
                                                fontSize: '0.875rem',
                                                padding: '6px 12px',
                                                marginBottom: '8px !important'
                                            }
                                        },
                                        arrow: {
                                            sx: {
                                                color: 'common.black'
                                            }
                                        }
                                    }}>
                                        <div style={{
                                            backgroundColor: selectedWard.color,
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '1px solid #ddd',
                                            cursor: 'help'
                                        }}/>
                                    </Tooltip>
                                )}
                                <span>{selectedWard?.name || ''}</span>
                            </Box>
                        );
                    }}
                >
                    {wards.map((ward) => (
                        <MenuItem key={ward.id} value={ward.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title={ward.color} arrow placement="top" slotProps={{
                                    tooltip: {
                                        sx: {
                                            backgroundColor: 'common.black',
                                            fontSize: '0.875rem',
                                            padding: '6px 12px',
                                            marginBottom: '8px !important'
                                        }
                                    },
                                    arrow: {
                                        sx: {
                                            color: 'common.black'
                                        }
                                    }
                                }}>
                                    <div style={{
                                        backgroundColor: ward.color,
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: '1px solid #ddd',
                                        cursor: 'help'
                                    }} />
                                </Tooltip>
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