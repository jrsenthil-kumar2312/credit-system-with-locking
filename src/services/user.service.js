/**
 * User service which serves DB operation
 * required by user controller
 *
 */
import db from '../models/index.js';

/**
 * @constant {Sequelize.models} - User & Credit model extracted from db import
 */
const { CreditUser } = db.db;

/**
 * findAll function to retrieve all available users in system
 *
 * @returns {Promise} User object array
 */
const findAll = async () => CreditUser.findAll({});

/**
 * findById function to fetch data for provided userId
 *
 * @param {number} userId - user id for which data needs to be fetched
 * @returns {Promise} User object
 */
const findById = async userId => CreditUser.findOne({ where: { id: userId } });

/**
 * findById function to fetch data for provided userId
 *
 * @param {number} userId - user id for which data needs to be fetched
 * @returns {Promise} User objectw
 */
const findByUsername = async username => CreditUser.findOne({ where: { username } });

/**
 * create function to add new user
 *
 * @param {object} data - user object with information to be saved in system
 * @returns {Promise} Created user object
 */
const create = async data => CreditUser.create(data, {});

export {
  findAll,
  findById,
  findByUsername,
  create,
};
