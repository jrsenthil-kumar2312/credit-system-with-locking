import express from 'express';

import { getHealth } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     description: Health Check Endpoint
 *     responses:
 *       200:
 *         description: Application health details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   format: float
 *                   description: Time (in seconds) specifying application running from how long
 *                 message:
 *                   type: string
 *                   description: Status message ok
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Current date in ISO format
 */
router
  .route('/')
  .get(getHealth);

export default router;
