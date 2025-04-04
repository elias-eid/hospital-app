/**
 * Ward Form Component
 *
 * A reusable form dialog for creating/editing ward records with:
 * - Name field
 * - Color selection with visual color indicators
 * - Form validation and error display
 * - Cancel/Save actions
 *
 * @component
 * @param {string} wardName - Current ward name value
 * @param {Function} setWardName - Ward name setter function
 * @param {string} color - Currently selected color
 * @param {Function} setColor - Color setter function
 * @param {string|null} errorName - Ward name validation error
 * @param {string|null} errorColor - Color selection validation error
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
    Box
} from '@mui/material';

interface WardFormProps {
    wardName: string;
    setWardName: (name: string) => void;
    color: string;
    setColor: (color: string) => void;
    errorName: string | null;
    errorColor: string | null;
    onSave: () => void;
    onCancel: () => void;
}

const WardForm: React.FC<WardFormProps> = ({
                                               wardName,
                                               setWardName,
                                               color,
                                               setColor,
                                               errorName,
                                               errorColor,
                                               onSave,
                                               onCancel
                                           }) => {
    const colors = ['Red', 'Green', 'Blue', 'Yellow'];

    return (
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Ward Name"
                fullWidth
                variant="outlined"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                error={!!errorName}
                helperText={errorName}
            />
            <FormControl fullWidth margin="normal" error={!!errorColor}>
                <InputLabel>Color</InputLabel>
                <Select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    label="Color"
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <div style={{
                                backgroundColor: selected,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '1px solid #ddd'
                            }} />
                            <span>{selected}</span>
                        </Box>
                    )}
                >
                    {colors.map((colorName) => (
                        <MenuItem key={colorName} value={colorName}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <div style={{
                                    backgroundColor: colorName,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: '1px solid #ddd'
                                }} />
                                <span>{colorName}</span>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
                {errorColor && <Typography variant="body2" color="error">{errorColor}</Typography>}
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

export default WardForm;
