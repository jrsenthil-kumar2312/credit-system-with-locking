import express from 'express';
import { Validator } from 'express-json-validator-middleware';

import {
  addUser, getUsers, getUser, loginUser,
} from '../../controllers/user.controller.js';
import { addUserSchema } from '../../validations/users-request.schema.js';

const router = express.Router();
const { validate } = new Validator();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first/given name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: The user's surname/family name.
 *           example: Doe
 *
 *     LoginUserRequest:
 *       allOf:
 *       - type: object
 *         properties:
 *           username:
 *             type: string
 *             description: The user's username for login.
 *             example: "johndoe23"
 *           password:
 *             type: string
 *             description: The user's username for login.
 *             example: "abcd1234"
 *
 *     CreateUserRequest:
 *       allOf:
 *       - $ref: '#/components/schemas/User'
 *       - type: object
 *         properties:
 *           username:
 *             type: string
 *             description: The user's username for login.
 *             example: "johndoe23"
 *           password:
 *             type: string
 *             description: The user's username for login.
 *             example: "abcd1234"
 *
 *     CreateUserSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Flag stating status of API call
 *           example: true
 *         body:
 *           allOf:
 *           - $ref: '#/components/schemas/User'
 *           - type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: Id generated for created user.
 *                 example: 1
 *
 *     LoginUserSuccess:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Authentication token
 *           example: "testing"
 *
 */

/**
 * @openapi
  * /v1/users/login:
 *   post:
 *     tags:
 *       - v1
 *     description: Endpoint to create/add new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             $ref: '#/components/schemas/LoginUserRequest'
 *
 *     responses:
 *       200:
 *         description: User created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserSuccess'
 *
 * /v1/users:
 *   post:
 *     tags:
 *       - v1
 *     description: Endpoint to create/add new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       200:
 *         description: User created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserSuccess'
 *
 * /v1/users/userId:
 *   get:
 *     tags:
 *       - v1
 *     description: Endpoint to retrieve user details
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: User details retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserSuccess'
 *
 */

router
  .route('/login')
  .post(loginUser);

router
  .route('/')
  .post(validate({ body: addUserSchema }), addUser)
  .get(getUsers);

router
  .route('/:userId([0-9]+)')
  .get(getUser);

export default router;
