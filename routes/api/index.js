const router = require('express').Router();
const lamppostRoutes = require('./lamppostRoutes');

router.use('/lamppost', lamppostRoutes);

module.exports = router;
