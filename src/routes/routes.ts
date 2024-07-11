import express from 'express';
import { getAllCanonico } from './canonico';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Bem-vindo à API!');
});

/** Listar todos canônicos. */
router.get('/canonicos', getAllCanonico);

export default router;