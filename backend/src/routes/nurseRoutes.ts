import express from 'express';
import {
    getAllNurses,
    getNurseById,
    createNurse,
    updateNurse,
    deleteNurse,
} from '../controllers/nurseController';

const router = express.Router();

router.get('/', getAllNurses);
router.get('/:id', getNurseById);
router.post('/', createNurse);
router.get('/:id', getNurseById);
router.put('/:id', updateNurse);
router.delete('/:id', deleteNurse);

export default router;

