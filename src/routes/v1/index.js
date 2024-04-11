import express from 'express';

import usersRoute from './user.route.js';
import creditRoute from './credit.route.js';

const router = express.Router({ mergeParams: true });

router.use('/credit/users/:userId([0-9]+)', creditRoute);

router.use('/users', usersRoute);

export default router;
