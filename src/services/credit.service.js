/**
 * Credit service which serves DB operation
 * required by credit controller
 *
 */
import { EmptyResultError, Sequelize } from 'sequelize';
import db from '../models/index.js';
import { CreditActionType } from '../constant.js';
import * as errors from '../utils/api-error.js';
import sequelize from '../config/sequelize.js';

/**
 * @constant {Sequelize.models} - CreditUser & Credit model extracted from db import
 */
const { Credit } = db.db;
const { NotFoundError, Conflict } = errors.default;

/**
 * To fetch latest credit data for provided userId
 *
 * @param {number} userId - user id for which data needs to be fetched
 * @param {object} transaction - transaction in which the query to be executed if provided.
 * @returns {Promise} Credit object
 */
const getLatestCreditDetailsByUserId = async (userId, transaction = null) => {
  const latestCreditDetails = await Credit.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']],
  }, { transaction });

  if (latestCreditDetails === null) {
    throw new EmptyResultError('No credit details for the specified user.');
  }

  return latestCreditDetails;
};

/**
 * Create function to add credit by user id.
 *
 * @param {number} userId - user id for the user to add credit for.
 * @param {number} amount - amount of credit to be added for the user.
 */
const addCreditByUserId = async (userId, amount) => {
  const t = await sequelize.transaction();
  try {
    // Lock the Credit table for write (exclusive lock)
    await sequelize.query('LOCK TABLE credit IN SHARE ROW EXCLUSIVE MODE', { transaction: t });

    // Create a new row in the Credit table with the calculated balance
    await Credit.create({
      userId,
      amount,
      action_type: CreditActionType.ADD,
      balance: sequelize.literal(
        `coalesce((SELECT balance FROM credit where user_id=${userId} 
          ORDER BY created_at DESC LIMIT 1), 0) + ${amount}`,
      ),
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    // Rollback the transaction if any error occurs
    await t.rollback();

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      throw new NotFoundError();
    }

    throw new Error('Failed to add credit.');
  }
};

/**
 * Create function to deduct credit by user id.
 *
 * @param {number} userId - user id for which data needs to be fetched
 * @param {number} amount - amount of credit to be deducted for the user.
 */
const deductCreditByUserId = async (userId, amount) => {
  let creditBalance = 0;

  const t = await sequelize.transaction();
  try {
    await sequelize.query('LOCK TABLE credit IN SHARE ROW EXCLUSIVE MODE', { transaction: t });

    await getLatestCreditDetailsByUserId(userId, t)
      .then(creditDetails => {
        creditBalance = creditDetails.balance;
      });

    const creditBalanceAfterDeduction = creditBalance - amount;

    if (creditBalance === 0 || creditBalanceAfterDeduction < 0) {
      throw new Conflict('Insufficient credit balance');
    }

    await Credit.create({
      userId,
      amount,
      action_type: CreditActionType.DEDUCT,
      balance: creditBalanceAfterDeduction,
    }, { transaction: t });

    await t.commit();

  } catch (error) {

    await t.rollback();

    if (error instanceof EmptyResultError) {
      throw new NotFoundError();
    }

    throw new Error('Failed to deduct credit.');
  }
};


/**
 * Function to re-calculate and update user's credit balance.
 *
 * @param {number} userId - user id for which data needs to be fetched
 */
const reCalculateCreditBalance = async userId => {
  // To save number of of times we hit database,
  // the sum of each action was calculated in a single query.
  // This is good to improve response time but it hurts code readability.

  const t = await sequelize.transaction();

  try {
    await sequelize.query('LOCK TABLE credit IN SHARE ROW EXCLUSIVE MODE', { transaction: t });

    const latestUserCreditDetails = await getLatestCreditDetailsByUserId(userId, t);

    const creditAmountDetails = await Credit.findAll({
      where: { userId },
      attributes: [
        'action_type',
        [Sequelize.fn('SUM', Sequelize.col('Credit.amount')), 'totalAmount'],
      ],
      group: 'action_type',
    }, { transaction: t });

    if (creditAmountDetails === null) {
      throw new EmptyResultError('No credit details for the specified user.');
    }

    const addedCreditSum = creditAmountDetails.find(
      credit => credit.action_type === CreditActionType.ADD,
    )?.dataValues.totalAmount || 0;

    const deductedCreditSum = creditAmountDetails.find(
      credit => credit.action_type === CreditActionType.DEDUCT,
    )?.dataValues.totalAmount || 0;

    const reCalculatedBalance = addedCreditSum - deductedCreditSum;

    if (reCalculatedBalance < 0) {
      throw new Error('There is a mismatch in balance. Manual verification is needed.');
    }

    if (latestUserCreditDetails.balance !== reCalculatedBalance) {
      latestUserCreditDetails.update({ balance: reCalculatedBalance });
    }

    await t.commit();
  } catch (error) {
    await t.rollback();

    if (error instanceof EmptyResultError) {
      throw new NotFoundError();
    }

    throw new Error('Failed to deduct credit.');
  }
};

export {
  getLatestCreditDetailsByUserId,
  addCreditByUserId,
  deductCreditByUserId,
  reCalculateCreditBalance,
};
