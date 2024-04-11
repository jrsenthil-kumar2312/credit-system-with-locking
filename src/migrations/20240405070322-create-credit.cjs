const { Sequelize, DataTypes } = require('sequelize');

const tableNames = ['credit', 'credit_user'];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE enum_credit_action_type AS ENUM ('Add', 'Deduct');

      CREATE TABLE IF NOT EXISTS public."credit"
      (
          id serial NOT NULL,
          user_id integer NOT NULL,
          action_type enum_credit_action_type,
          amount integer NOT NULL,
          balance integer NOT NULL,
          created_at timestamp with time zone default CURRENT_TIMESTAMP,
          updated_at timestamp with time zone default CURRENT_TIMESTAMP,
          CONSTRAINT credit_pkey PRIMARY KEY (id),
          CONSTRAINT "credit_user_id_fkey" FOREIGN KEY (user_id)
              REFERENCES public."credit_user" (id) MATCH SIMPLE
              ON UPDATE NO ACTION
              ON DELETE NO ACTION
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tablePromises = tableNames.map(async table => {
        await queryInterface.dropTable(table, { transaction, cascade: true });
      });

      await Promise.all(tablePromises);
    });
  }
};
