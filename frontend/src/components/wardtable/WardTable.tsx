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
import {Ward} from '../../types';
import {Tooltip, Paper} from '@mui/material';

interface WardTableProps {
    wards: Ward[];
    onEdit: (ward: Ward) => void;
    onDelete: (id: number, name: string) => void;
}

const WardTable: React.FC<WardTableProps> = ({wards, onEdit, onDelete}) => {
    const apiRef = useGridApiRef();

    // Save the grid state to sessionStorage when state changes
    useEffect(() => {
        const handleStateChange = (params: any) => {
            sessionStorage.setItem('wardsTableState', JSON.stringify(params));
        };

        const unsubscribe = apiRef.current?.subscribeEvent('stateChange', handleStateChange);

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [apiRef]);

    // Retrieve saved state from sessionStorage (if it exists)
    const savedState = JSON.parse(sessionStorage.getItem('wardsTableState') || 'null');

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
            width: 120,
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
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={() => onEdit(params.row)}
                    color="inherit"
                />,
                <Tooltip
                    title={
                        params.row.hasNurses
                            ? `${params.row.name} cannot be deleted because it has nurses.`
                            : ''
                    }
                    arrow
                >
                    <span>
                        <GridActionsCellItem
                            icon={<DeleteIcon/>}
                            label="Delete"
                            onClick={() => onDelete(params.row.id, params.row.name)}
                            disabled={params.row.hasNurses}
                            color="inherit"
                        />
                    </span>
                </Tooltip>,
            ],
        },
    ];

    const getInitialState = () => {
        const defaultState = {
            pagination: {
                paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
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
        <Paper style={{height: 600, width: '100%'}}>
            <DataGrid
                rows={wards}
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

export default WardTable;
