'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('credit', [{
      user_id: 1,
      amount: 100,
      action_type: "Add",
      balance: 100,
    },
    {
      user_id: 2,
      amount: 50,
      action_type: "Add",
      balance: 50,
    },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('credit', null, {});
  }
};