const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./api/comment-routes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
