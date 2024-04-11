/**
 * Credit controller
 *
 */
import httpStatus from 'http-status';

import * as errors from '../utils/api-error.js';
import * as response from '../middlewares/response-handler.js';
import {
  getLatestCreditDetailsByUserId, deductCreditByUserId, addCreditByUserId, reCalculateCreditBalance,
} from '../services/credit.service.js';

const TOTAL_CREDIT_TO_DEDUCT_PER_CALL = 1;

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
 * to retrieve specific user's credit
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const getBalanceCredit = async (req, res) => {
  const creditDetails = await getLatestCreditDetailsByUserId(req.params.userId);
  if (!creditDetails) {
    throw new NotFoundError();
  }

  res.status(httpStatus.OK).send(responseHandler({ creditBalance: creditDetails.balance }));
};

/**
 * Function which provides functionality
 * to deduct a specific user's credit.
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const deductCredit = async (req, res) => {
  await deductCreditByUserId(req.params.userId, TOTAL_CREDIT_TO_DEDUCT_PER_CALL);
  res.status(httpStatus.OK).send(responseHandler());
};

/**
 * Function which provides functionality
 * to add credit for a specific user.
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 *
 * @throws {NotFoundError} - if no such user exists for provided userId
 */
const addCredit = async (req, res) => {
  await addCreditByUserId(req.params.userId, req.body.amount);
  res.status(httpStatus.OK).send(responseHandler());
};

/**
 * Function which provides functionality
 * to recalculate user's credit balance.
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 *
 * @throws {NotFoundError} - if no such user exists for provided userId
 */
const reCalculateUserCreditBalance = async (req, res) => {
  await reCalculateCreditBalance(req.params.userId, req.body.amount);
  res.status(httpStatus.OK).send(responseHandler());
};

export {
  getBalanceCredit,
  deductCredit,
  addCredit,
  reCalculateUserCreditBalance,
};
