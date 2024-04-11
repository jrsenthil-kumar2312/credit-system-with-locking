import db from '../src/models/index.js';

const { CreditUser, Credit } = db.db;

const truncateTables = async () => {
  await CreditUser.destroy({ truncate: true, cascade: true });
  await Credit.destroy({ truncate: true, cascade: true });
};

const insertUserData = async data => {
  await CreditUser.create(data, {});
};

const insertCreditData = async data => {
  await Credit.create(data, {
    include: [
      { model: CreditUser },
    ],
  });
};

export {
  truncateTables,
  insertUserData,
  insertCreditData,
};
