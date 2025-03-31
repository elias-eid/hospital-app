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

import React, {useEffect} from 'react';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridToolbar,
    GridRowParams,
    useGridApiRef
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Nurse } from '../../types';
import { Paper } from '@mui/material';

interface NurseTableProps {
    nurses: Nurse[];
    onEdit: (nurse: Nurse) => void;
    onDelete: (id: number, name: string) => void;
}

const NurseTable: React.FC<NurseTableProps> = ({ nurses, onEdit, onDelete }) => {
    const apiRef = useGridApiRef();

    // Save the grid state to sessionStorage when state changes
    useEffect(() => {
        const handleStateChange = (params: any) => {
            sessionStorage.setItem('nursesTableState', JSON.stringify(params));
        };

        const unsubscribe = apiRef.current?.subscribeEvent('stateChange', handleStateChange);

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [apiRef]);

    // Retrieve saved state from sessionStorage (if it exists)
    const savedState = JSON.parse(sessionStorage.getItem('nursesTableState') || 'null');

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
            width: 150
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
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => onEdit(params.row)}
                    color="inherit"
                />,
                <span>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => onDelete(params.row.id, params.row.full_name)}
                        color="inherit"
                    />
                </span>
            ],
        },
    ];

    const getInitialState = () => {
        const defaultState = {
            pagination: {
                paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: { sortModel: [{ field: 'full_name', sort: 'asc' }] },
        };

        if (!savedState) return defaultState;

        return {
            ...savedState,
            pagination: {
                paginationModel: {
                    pageSize: savedState.pagination?.paginationModel?.pageSize || 10,
                    page: savedState.pagination?.paginationModel?.page || 0,
                },
            },
        };
    };

    return (
        <Paper style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={nurses}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                slots={{
                    toolbar: GridToolbar,
                }}
                apiRef={apiRef}
                initialState={getInitialState()}
                disableColumnMenu={false}
                disableColumnSelector={false}
                disableDensitySelector={false}
            />
        </Paper>
    );
};

export default NurseTable;