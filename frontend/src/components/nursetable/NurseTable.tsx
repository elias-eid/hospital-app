/**
 * Nurse Data Table Component
 *
 * Displays a paginated, sortable table of nurse records with:
 * - Persistent state management using sessionStorage
 * - Built-in filtering and toolbar functionality
 * - Edit/Delete action buttons
 *
 * @component
 * @param {Nurse[]} nurses - Array of nurse objects to display
 * @param {(nurse: Nurse) => void} onEdit - Callback when edit action is clicked
 * @param {(id: number, name: string) => void} onDelete - Callback when delete action is clicked
 *
 */

import React from 'react';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridToolbar,
    GridRowParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Nurse} from '../../types';
import {Box, Paper, Tooltip} from '@mui/material';

interface NurseTableProps {
    nurses: Nurse[];
    onEdit: (nurse: Nurse) => void;
    onDelete: (id: number, name: string) => void;
}

const NurseTable: React.FC<NurseTableProps> = ({nurses, onEdit, onDelete}) => {
    // Create a unique key based on ward IDs and timestamps
    const dataKey = React.useMemo(() => {
        return nurses.map(n => `${n.id}-${n.modified_at}`).join('|');
    }, [nurses]);

    // Retrieve and parse saved state safely
    const savedState = React.useMemo(() => {
        try {
            const state = JSON.parse(sessionStorage.getItem('nursesTableState') || '{pagination: {\n' +
                '                    paginationModel: {\n' +
                '                        pageSize: state.pagination?.paginationModel?.pageSize || 10,\n' +
                '                        page: state.pagination?.paginationModel?.page || 0,\n' +
                '                    },\n' +
                '                }}');
            return {
                ...state,
                pagination: {
                    paginationModel: {
                        pageSize: state.pagination?.paginationModel?.pageSize || 10,
                        page: state.pagination?.paginationModel?.page || 0,
                    },
                },
            };
        } catch {
            return {
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'full_name', sort: 'asc' }] },
            };
        }
    }, []);


    // Handle state persistence on sort/filter/page change
    const handleStateChange = (state: any) => {
        sessionStorage.setItem('nursesTableState', JSON.stringify(state));
    };

    const columns: GridColDef<Nurse>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70
        },
        {
            field: 'employee_id',
            headerName: 'Employee ID',
            width: 150
        },
        {
            field: 'first_name',
            headerName: 'First Name',
            width: 150
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 150
        },
        {
            field: 'full_name',
            headerName: 'Full Name',
            width: 150
        },
        {
            field: 'ward_name',
            headerName: 'Ward',
            width: 180,
            renderCell: (params) => {
                const wardColor = params.row.ward_color;
                return (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Tooltip title={wardColor || 'No color'} arrow placement="top" slotProps={{
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
                                backgroundColor: wardColor,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                cursor: 'help'
                            }}/>
                        </Tooltip>
                        <span>{params.value}</span>
                    </Box>
                );
            }
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 180,
            valueFormatter: (value: string) => new Date(value).toLocaleString()
        },
        {
            field: 'modified_at',
            headerName: 'Modified At',
            width: 180,
            valueFormatter: (value: string) => new Date(value).toLocaleString()
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 120,
            getActions: (params: GridRowParams<Nurse>) => [
                <GridActionsCellItem
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={() => onEdit(params.row)}
                    color="inherit"
                />,
                <span>
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={() => onDelete(params.row.id, params.row.full_name)}
                        color="inherit"
                    />
                </span>
            ],
        },
    ];


    return (
        <Paper style={{height: 600, width: '100%'}}>
            <DataGrid
                rows={nurses}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={savedState}
                onStateChange={handleStateChange}
                disableColumnMenu={false}
                disableColumnSelector={false}
                disableDensitySelector={false}
                key={dataKey}
                getRowId={(row) => row.id}
            />
        </Paper>
    );
};

export default NurseTable;