import knexConfig from '../../knexfile';
import Knex from 'knex';
import { Request, Response } from 'express';
import moment from 'moment-timezone';

// Initialize Knex with the configuration
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

// Get all wards
export const getAllWards = async (req: Request, res: Response) => {
    try {
        // Get wards along with the number of associated nurses
        const wards = await knex('wards')
            .leftJoin('nurses', 'wards.id', 'nurses.ward_id')
            .select('wards.*', knex.raw('COUNT(nurses.id) as nurses_count'))
            .groupBy('wards.id');

        // Convert timestamps to EDT and add the hasNurses field
        const updatedWards = wards.map(ward => {
            ward.created_at = moment(ward.created_at).tz('America/New_York').format();
            ward.modified_at = moment(ward.modified_at).tz('America/New_York').format();
            ward.hasNurses = ward.nurses_count > 0; // Check if ward has nurses
            delete ward.nurses_count; // Remove the nurses_count field
            return ward;
        });

        res.json(updatedWards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving wards' });
    }
};

// Get ward by ID
export const getWardById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ward = await knex('wards').where({ id }).first();
        if (ward) {
            // Convert timestamps to EDT
            ward.created_at = moment(ward.created_at).tz('America/New_York').format();
            ward.modified_at = moment(ward.modified_at).tz('America/New_York').format();

            res.json(ward);
        } else {
            res.status(404).json({ message: 'Ward not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving ward' });
    }
};

// Create a new ward
export const createWard = async (req: Request, res: Response) => {
    const { name, color } = req.body;
    const trx = await knex.transaction();  // Start transaction

    try {
        const [newWard] = await trx('wards').insert({ name, color }).returning('*');
        await trx.commit();  // Commit transaction
        newWard.created_at = moment(newWard.created_at).tz('America/New_York').format();
        newWard.modified_at = moment(newWard.modified_at).tz('America/New_York').format();
        res.status(201).json(newWard);
    } catch (error) {
        await trx.rollback();  // Rollback on error
        console.error(error);
        res.status(500).json({ message: 'Error creating ward' });
    }
};


// Update an existing ward
export const updateWard = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, color } = req.body;

    try {
        await knex.transaction(async (trx) => {
            const updatedWard = await trx('wards')
                .where({ id })
                .update({
                    name,
                    color,
                    modified_at: trx.raw('CURRENT_TIMESTAMP')  // Update modified_at field
                })
                .returning('*');

            if (updatedWard.length === 0) {
                return res.status(404).json({ message: 'Ward not found' });
            }
            updatedWard[0].created_at = moment(updatedWard[0].created_at).tz('America/New_York').format();
            updatedWard[0].modified_at = moment(updatedWard[0].modified_at).tz('America/New_York').format();
            res.json(updatedWard[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating ward' });
    }
};

// Delete a ward
export const deleteWard = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await knex.transaction(async (trx) => {
            // Check if any nurses are assigned to this ward
            const nursesCount = await trx('nurses').where({ ward_id: id }).count('id as count');

            // If there are nurses assigned, prevent deletion
            if (Number(nursesCount[0].count) > 0) {
                return res.status(400).json({ message: 'Cannot delete ward: Nurses are still assigned to it.' });
            }

            // Proceed with deletion
            const deletedWard = await trx('wards').where({ id }).del().returning('*');

            if (deletedWard.length === 0) {
                return res.status(404).json({ message: 'Ward not found' });
            }

            res.json({ message: 'Ward deleted successfully', ward: deletedWard[0] });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting ward' });
    }
};

