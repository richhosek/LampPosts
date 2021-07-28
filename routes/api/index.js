const router = require('express').Router();
const lamppostRoutes = require('./lamppostRoutes');
const volunteerRoutes = require('./volunteerRoutes');

router.use('/lamppost', lamppostRoutes);
router.use('/volunteer', volunteerRoutes);

module.exports = router;
