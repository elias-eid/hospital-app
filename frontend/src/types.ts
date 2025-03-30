export interface Ward {
    id: number;
    name: string;
    color: string;
    created_at: string;
    modified_at: string;
    hasNurses: boolean;
}

export interface Nurse {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    ward_id: number;
    ward_name: string;
    created_at: string;
    modified_at: string;
}
