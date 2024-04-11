/**
 * User controller
 *
 */
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import * as errors from '../utils/api-error.js';
import * as response from '../middlewares/response-handler.js';
import {
  findAll, findById, findByUsername, create,
} from '../services/user.service.js';

/**
 * @constant {function} responseHandler - function to form generic success response
 */
const responseHandler = response.default;
/**
 * @constant {NotFoundError} NotFoundError - not found error object
 */
const { NotFoundError } = errors.default;

/**
 * Function which provides functionality
 * to add/create new user in system
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const loginUser = async (req, res) => {
  const user = await findByUsername(req.body.username, req.body.password);

  if (user) {
    const token = jwt.sign({ userId: user.id, userName: user.username}, process.env.TOKEN_SECRET);
    res.json({ token });
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }
};

/**
 * Function which provides functionality
 * to add/create new user in system
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const addUser = async (req, res) => {
  const userDetails = await create(req.body);
  
  res.status(httpStatus.CREATED).send(responseHandler());
};

/**
 * Function which provides functionality
 * to retrieve all users present in system
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const getUsers = async (req, res) => {
  const users = await findAll();
  res.status(httpStatus.OK).send(responseHandler(users));
};

/**
 * Function which provides functionality
 * to retrieve specific user based on provided userId
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 *
 * @throws {NotFoundError} - if no such user exists for provided userId
 */
const getUser = async (req, res) => {
  const user = await findById(req.params.userId);
  if (!user) {
    throw new NotFoundError();
  }

  res.status(httpStatus.OK).send(responseHandler(
    { first_name: user.firstName, last_name: user.lastName },
  ));
};

export {
  loginUser,
  addUser,
  getUsers,
  getUser,
};
