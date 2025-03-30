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
import { Nurse } from '../../types';
import { Paper } from '@mui/material';

interface NurseTableProps {
    nurses: Nurse[];
    onEdit: (nurse: Nurse) => void;
    onDelete: (id: number, name: string) => void;
}

const NurseTable: React.FC<NurseTableProps> = ({ nurses, onEdit, onDelete }) => {
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

    return (
        <Paper style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={nurses}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },  // Default page size
                    },
                    sorting: {
                        sortModel: [{ field: 'full_name', sort: 'asc' }],
                    },
                }}
                disableColumnMenu={false}
                disableColumnSelector={false}
                disableDensitySelector={false}
            />
        </Paper>
    );
};

export default NurseTable;