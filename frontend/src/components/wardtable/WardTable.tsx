/**
 * Ward Data Table Component
 *
 * Displays a paginated, sortable table of ward records with:
 * - Persistent state management using sessionStorage
 * - Built-in filtering and toolbar functionality
 * - Edit/Delete action buttons with deletion restrictions for wards with nurses
 *
 * @component
 * @param {Ward[]} wards - Array of ward objects to display
 * @param {(ward: Ward) => void} onEdit - Callback when edit action is clicked
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
import { Ward } from '../../types';
import { Tooltip, Paper, Box } from '@mui/material';

interface WardTableProps {
    wards: Ward[];
    onEdit: (ward: Ward) => void;
    onDelete: (id: number, name: string) => void;
}

const WardTable: React.FC<WardTableProps> = ({ wards, onEdit, onDelete }) => {
    // Create a unique key based on ward IDs and timestamps
    const dataKey = React.useMemo(() => {
        return wards.map(w => `${w.id}-${w.modified_at}`).join('|');
    }, [wards]);

    // Retrieve and parse saved state safely
    const savedState = React.useMemo(() => {
        try {
            const state = JSON.parse(sessionStorage.getItem('wardsTableState') || '{pagination: {\n' +
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
                sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
            };
        }
    }, []);

    // Handle state persistence on sort/filter/page change
    const handleStateChange = (state: any) => {
        sessionStorage.setItem('wardsTableState', JSON.stringify(state));
    };

    const columns: GridColDef<Ward>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
        },
        {
            field: 'color',
            headerName: 'Color',
            width: 180,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div style={{
                        backgroundColor: params.value,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '1px solid #ddd'
                    }} />
                    <span>{params.value}</span>
                </Box>
            )
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 180,
            valueFormatter: (value: string) => new Date(value).toLocaleString(),
        },
        {
            field: 'modified_at',
            headerName: 'Modified At',
            width: 180,
            valueFormatter: (value: string) => new Date(value).toLocaleString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 120,
            getActions: (params: GridRowParams<Ward>) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => onEdit(params.row)}
                    color="inherit"
                    showInMenu={false}
                />,
                <Tooltip
                    placement="top"
                    slotProps={{
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
                    }}
                    title={
                        params.row.hasNurses
                            ? `${params.row.name} cannot be deleted because it has nurses.`
                            : ''
                    }
                    arrow
                >
                    <span>
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={() => onDelete(params.row.id, params.row.name)}
                            disabled={params.row.hasNurses}
                            color="inherit"
                            showInMenu={false}
                        />
                    </span>
                </Tooltip>,
            ],
        },
    ];

    return (
        <Paper style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={wards}
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

export default WardTable;