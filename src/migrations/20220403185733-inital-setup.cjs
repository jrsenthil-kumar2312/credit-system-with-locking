const { Sequelize, DataTypes } = require('sequelize');

const tableNames = ['credit_user'];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`

      CREATE TABLE IF NOT EXISTS public."credit_user"
      (
          id serial NOT NULL,
          first_name character varying(128) COLLATE pg_catalog."default",
          last_name character varying(128) COLLATE pg_catalog."default",
          username character varying(128) COLLATE pg_catalog."default" NOT NULL,
          password character varying(128) COLLATE pg_catalog."default" NOT NULL,
          created_at timestamp with time zone default CURRENT_TIMESTAMP,
          updated_at timestamp with time zone default CURRENT_TIMESTAMP,
          CONSTRAINT credit_user_pkey PRIMARY KEY (id),
          UNIQUE (username)
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