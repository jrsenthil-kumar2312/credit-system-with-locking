'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('credit_user', [{
      first_name: 'John',
      last_name: 'Doe',
      username: "JohnDoe23",
      password: "password",
    },
    {
      first_name: 'Mary',
      last_name: 'Doe',
      username: "MaryDoe23",
      password: "password2",
    },
  ], {ignoreDuplicates: true});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulksDelete('credit_user', null, {});
  }
};