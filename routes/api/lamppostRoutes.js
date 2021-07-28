const router = require('express').Router();
const { Lamppost } = require('../../models');

// GET all lampposts
router.get('/', async (req, res) => {
    try {
        const lamppostData = await Lamppost.findAll({order: [['lamppostId', 'asc']]});
        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/prepped/:id/:preppedBy", async (req, res) => {
    try {
        // console.log("prepped", req.params, new Date().toISOString())
        const updateResponse = await Lamppost.update({ preppedBy: req.params.preppedBy, preppedAt: new Date().toISOString(), status: "prepped" }, { where: { lamppost_id: req.params.id}});

        if (!updateResponse) {
            res.status(404).json({ message: 'No lamppost found with this id!' });
            return;
        }
        
        const lamppostData = await Lamppost.findOne({ where: { lamppost_id: req.params.id}});
        
        // res.end();
        res.status(200).json(lamppostData);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

router.get("/painted/:id/:paintedBy", async (req, res) => {
    try {
        let now = new Date().toISOString().replace("T", " ").replace("Z", "")
            .split(".")[0];
        console.log("painted", req.params, now)
        const updateResponse = await Lamppost.update({ paintedBy: req.params.paintedBy, paintedAt: now, status: "painted"}, { where: { lamppost_id: req.params.id}});

        if (!updateResponse) {
            res.status(404).json({ message: 'No lamppost found with this id!' });
            return;
        }
        
        const lamppostData = await Lamppost.findOne({ where: { lamppost_id: req.params.id}});
        
        // res.end();
        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/inspected/:id/:inspectedBy", async (req, res) => {
    try {
        let now = new Date().toISOString().replace("T", " ").replace("Z", "")
            .split(".")[0];
        console.log("inspected", req.params, now)
        const updateResponse = await Lamppost.update({ inspectedBy: req.params.inspectedBy, inspectedAt: now, status: "inspected" }, { where: { lamppost_id: req.params.id}});

        if (!updateResponse) {
            res.status(404).json({ message: 'No lamppost found with this id!' });
            return;
        }
        
        const lamppostData = await Lamppost.findOne({ where: { lamppost_id: req.params.id}});
        
        // res.end();
        res.status(200).json(lamppostData);
    } catch (err) {
        res.status(500).json(err);
    }
})




// GET a single lamppost
router.get('/:id', async (req, res) => {
    try {
        const lamppostData = await Lamppost.findOne({ where: { lamppost_id: req.params.id}});

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
