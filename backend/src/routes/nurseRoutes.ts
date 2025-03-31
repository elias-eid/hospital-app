import express from 'express';
import {
    getAllNurses,
    getNurseById,
    createNurse,
    updateNurse,
    deleteNurse,
    checkEmailUniqueness,
} from '../controllers/nurseController';

const router = express.Router();

router.get('/', getAllNurses);
router.get('/check-email', checkEmailUniqueness);
router.get('/:id', getNurseById);
router.post('/', createNurse);
router.put('/:id', updateNurse);
router.delete('/:id', deleteNurse);

export default router;

