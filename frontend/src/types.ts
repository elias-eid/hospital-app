/**
 * Ward Interface
 *
 * Represents a ward with the attributes:
 * - `id`: Unique identifier for the ward
 * - `name`: Name of the ward
 * - `color`: Color code for the ward (e.g., for UI representation)
 * - `created_at`: Timestamp when the ward was created
 * - `modified_at`: Timestamp when the ward was last modified
 * - `hasNurses`: Boolean indicating if the ward has nurses assigned to it
 *
 * @interface Ward
 */
export interface Ward {
    id: number;
    name: string;
    color: string;
    created_at: string;
    modified_at: string;
    hasNurses: boolean;
}

/**
 * Nurse Interface
 *
 * Represents a nurse with the attributes:
 * - `id`: Unique identifier for the nurse
 * - `employee_id`: Employee ID of the nurse (10 chars)
 * - `first_name`: First name of the nurse
 * - `last_name`: Last name of the nurse
 * - `full_name`: Full name (combination of `first_name` and `last_name`)
 * - `email`: Email address of the nurse
 * - `ward_id`: ID of the ward the nurse is assigned to
 * - `ward_name`: Name of the ward the nurse is assigned to
 * - `created_at`: Timestamp when the nurse's record was created
 * - `modified_at`: Timestamp when the nurse's record was last modified
 *
 * @interface Nurse
 */

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
