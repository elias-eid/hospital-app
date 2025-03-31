import knexConfig from '../../knexfile';
import Knex from 'knex';
import { Request, Response } from 'express';
import moment from 'moment-timezone';

// Initialize Knex with the configuration
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

// Get all nurses
export const getAllNurses = async (req: Request, res: Response) => {
    try {
        const nurses = await knex('nurses')
            .select(
                'nurses.id',
                'nurses.employee_id',
                'nurses.first_name',
                'nurses.last_name',
                knex.raw("CONCAT(nurses.first_name, ' ', nurses.last_name) AS full_name"), // Adding full_name column
                'nurses.email',
                'nurses.ward_id',
                'wards.name as ward_name', // Grabbing the ward name from the wards table
                'nurses.created_at',
                'nurses.modified_at',
            )
            .leftJoin('wards', 'nurses.ward_id', 'wards.id'); // Join wards table

        // Convert timestamps to EDT
        const updatedNurses = nurses.map(nurse => ({
            ...nurse,
            created_at: moment(nurse.created_at).tz('America/New_York').format(),
            modified_at: moment(nurse.modified_at).tz('America/New_York').format(),
        }));

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

    const { nanoid } = require('nanoid');
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

        const ward = await trx('wards')
            .where('id', wardId)
            .first();

        await trx.commit();

        // return new nurse with computed fields (full name and ward)
        res.status(201).json({
            ...newNurse,
            full_name: `${firstName} ${lastName}`,
            ward_name: ward?.name || 'Unknown',
        });
    } catch (error) {
        await trx.rollback();
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

            const ward = await trx('wards')
                .where('id', wardId)
                .first();

            res.status(200).json({
                ...updatedNurse[0],
                full_name: `${updatedNurse[0].first_name} ${updatedNurse[0].last_name}`,
                ward_name: ward?.name || 'Unknown',
            });
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

// Check if the email address is unique
export const checkEmailUniqueness = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.query;
    console.log(email)
    try {
        const existingNurse = await knex('nurses').where({ email }).first();
        console.log(existingNurse)
        res.status(200).json({ exists: !!existingNurse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking email uniqueness' });
    }
};


