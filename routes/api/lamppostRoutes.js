const router = require('express').Router();
const { Lamppost } = require('../../models');

// GET all lampposts
router.get('/', async (req, res) => {
    try {
        const lamppostData = await Lamppost.findAll();
        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single lamppost
router.get('/:id', async (req, res) => {
    try {
        const lamppostData = await Lamppost.findByPk(req.params.id, {
            // JOIN with locations, using the Trip through table
            include: [{ model: Location, through: Trip, as: 'planned_trips' }]
        });

        if (!lamppostData) {
            res.status(404).json({ message: 'No lamppost found with this id!' });
            return;
        }

        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE a lamppost
router.post('/', async (req, res) => {
    try {
        console.log("Incoming Lamppost", req.body)
        const lamppostData = await Lamppost.create(req.body);
        console.log("Database Lamppost", lamppostData)
        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE a lamppost
router.delete('/:id', async (req, res) => {
    try {
        const lamppostData = await Lamppost.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!lamppostData) {
            res.status(404).json({ message: 'No lamppost found with this id!' });
            return;
        }

        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
