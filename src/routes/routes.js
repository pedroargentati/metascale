import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Bem-vindo à API!');
});

export default router;