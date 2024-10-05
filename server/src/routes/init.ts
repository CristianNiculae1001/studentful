import express from 'express';

const router = express.Router();

router.get('/init', (req, res) => {
    res.json({
        message: 'Server init',
    });
});

export default router;