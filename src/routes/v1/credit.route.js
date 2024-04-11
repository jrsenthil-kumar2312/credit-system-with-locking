import express from 'express';
import { Validator } from 'express-json-validator-middleware';

import {
  addCredit, deductCredit, getBalanceCredit, reCalculateUserCreditBalance,
} from '../../controllers/credit.controller.js';
import { addCreditSchema } from '../../validations/credit-request.schema.js';

const router = express.Router({ mergeParams: true });
const { validate } = new Validator();

/**
 * @openapi
 * components:
 *   schemas:
 *     Credit:
 *       type: object
 *       properties:
 *         amount:
 *           type: integer
 *           description: Amount to add/deduct a user's credit.
 *           example: 1
 *         action_type:
 *           type: string
 *           description: Kind of credit action to take (add, deduct).
 *           enum: ['Add', 'Deduct']
 *
 *     AddCreditRequest:
 *       allOf:
 *       - $ref: '#/components/schemas/Credit'
 *       - type: object
 *         properties:
 *            amount: number
 *            description: The amount of credit to add.
 *
 *     ChangeCreditSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Flag stating status of API call
 *           example: true
 *
 */

/**
 * @openapi
 * /v1/credit/users/{userId}/balance:
 *   get:
 *     security:
 *       - Authorization: []
 *     tags:
 *       - v1
 *     description: Endpoint to get user's credit balance.
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *           type: integer
 *        required: true
 *        description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: Added user's credit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeCreditSuccess'
 *
 * /v1/credit/users/{userId}/add:
 *   post:
 *     security:
 *       - Authorization: []
 *     tags:
 *       - v1
 *     description: Endpoint to create/add user's credit.
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *           type: integer
 *        required: true
 *        description: Numeric ID of the user to add credit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       200:
 *         description: Added user's credit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeCreditSuccess'
 *
 * /v1/credit/users/{userId}/deduct:
 *   post:
 *     security:
 *       - Authorization: []
 *     tags:
 *       - v1
 *     description: Endpoint to deduct user's credit.
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *           type: integer
 *        required: true
 *        description: Numeric ID of the user to deduct credit from.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Deducted user's credit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeCreditSuccess'
 *
 *
 * /v1/credit/users/{userId}/recalculate:
 *   post:
 *     security:
 *       - Authorization: []
 *     tags:
 *       - v1
 *     description: Endpoint to re-calculate user's credit.
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *           type: integer
 *        required: true
 *        description: Numeric ID of the user to deduct credit from.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Recalculated user's credit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeCreditSuccess'
 *
 */

router
  .route('/balance')
  .get(getBalanceCredit);

router
  .route('/add')
  .post(validate({ body: addCreditSchema }), addCredit);

router
  .route('/deduct')
  .post((deductCredit));

router
  .route('/recalculate')
  .post(reCalculateUserCreditBalance);

export default router;
