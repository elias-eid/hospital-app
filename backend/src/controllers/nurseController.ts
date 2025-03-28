import knexConfig from '../../knexfile';
import Knex from 'knex';
import { Request, Response } from 'express';
import moment from 'moment-timezone';

// Initialize Knex with the configuration
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

// Get all nurses
export const getAllNurses = async (req: Request, res: Response) => {
    try {
        const nurses = await knex('nurses').select();

        // Convert timestamps to EDT
        const updatedNurses = nurses.map(nurse => {
            nurse.created_at = moment(nurse.created_at).tz('America/New_York').format();
            nurse.modified_at = moment(nurse.modified_at).tz('America/New_York').format();
            return nurse;
        });

        res.json(updatedNurses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving nurses' });
    }
};

// Get a nurse by id
export const getNurseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const nurse = await knex('nurses').where({ id }).first();
        if (nurse) {
            // Convert timestamps to EDT
            nurse.created_at = moment(nurse.created_at).tz('America/New_York').format();
            nurse.modified_at = moment(nurse.modified_at).tz('America/New_York').format();

            res.json(nurse);
        } else {
            res.status(404).json({ message: 'Nurse not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving nurse' });
    }
};

// Create a new nurse
export const createNurse = async (req: Request, res: Response) => {
    const { firstName, lastName, email, wardId } = req.body;

    const { nanoid } = await import('nanoid');
    const employeeId = nanoid(10);  // Generates a 10-character unique employee ID
    const trx = await knex.transaction();  // Start transaction

    try {
        const [newNurse] = await trx('nurses').insert({
            employee_id: employeeId,
            first_name: firstName,
            last_name: lastName,
            email,
            ward_id: wardId,
        }).returning('*');
        newNurse.created_at = moment(newNurse.created_at).tz('America/New_York').format();
        newNurse.modified_at = moment(newNurse.modified_at).tz('America/New_York').format();
        res.status(201).json(newNurse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating nurse' });
    }
};

// Update an existing nurse by id
export const updateNurse = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, email, wardId } = req.body;

    try {
        await knex.transaction(async (trx) => {
            const updatedNurse = await trx('nurses')
                .where({ id })
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    ward_id: wardId,
                    modified_at: trx.raw('CURRENT_TIMESTAMP')  // Update modified_at field
                })
                .returning('*');

            if (updatedNurse.length === 0) {
                return res.status(404).json({ message: 'Nurse not found' });
            }
            updatedNurse[0].created_at = moment(updatedNurse[0].created_at).tz('America/New_York').format();
            updatedNurse[0].modified_at = moment(updatedNurse[0].modified_at).tz('America/New_York').format();
            res.json(updatedNurse[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating nurse' });
    }
};

// Delete a nurse by id
export const deleteNurse = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await knex.transaction(async (trx) => {
            const deletedNurse = await trx('nurses').where({ id }).del().returning('*');

            if (deletedNurse.length === 0) {
                return res.status(404).json({ message: 'Nurse not found' });
            }

            res.json({ message: 'Nurse deleted successfully', ward: deletedNurse[0] });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting nurse' });
    }
};
