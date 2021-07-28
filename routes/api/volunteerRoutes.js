const router = require('express').Router();
const { Volunteer } = require('../../models');

// GET all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll();
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single volunteer
router.get('/:id', async (req, res) => {
  try {
    const volunteerData = await Volunteer.findByPk(req.params.id, {
      // JOIN with travellers, using the Trip through table
      include: [{ model: Traveller, through: Trip, as: 'volunteer_travellers' }]
    });

    if (!volunteerData) {
      res.status(404).json({ message: 'No volunteer found with this id!' });
      return;
    }

    res.status(200).json(volunteerData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a volunteer
router.post('/', async (req, res) => {
  try {
    const existingVolunteer = await Volunteer.findOne({where: {name: req.body.name, type: req.body.type}});
    if (existingVolunteer) {
        return res.status(200).json(existingVolunteer);
    }

        

    const volunteer = await Volunteer.create(req.body);
    res.status(200).json(volunteer);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/{id}/{status}", async (req, res) => {
    try {
        const updateResponse = await Volunteer.update({status: req.params.status}, {where : {id : req.params.id}})
        res.status(200).json(updateResponse)

    } catch (exception) {
        console.error(exception);
        res.status(400).json(exception)
    }
}) 

// DELETE a volunteer
router.delete('/:id', async (req, res) => {
  try {
    const volunteerData = await Volunteer.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!volunteerData) {
      res.status(404).json({ message: 'No volunteer found with this id!' });
      return;
    }

    res.status(200).json(volunteerData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
