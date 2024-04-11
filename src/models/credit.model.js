/**
 * Model class for "credit"
 *
 *
 * @param {Sequelize} sequelize - sequelize object
 * @param {Sequelize.DataTypes} DataTypes - sequelize datatypes
 *
 * @returns Credit - sequelize model for credit entity
 */
export default (sequelize, DataTypes) => {
  const Credit = sequelize.define('Credit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'credit_user',
        key: 'id',
      },
    },
    action_type: {
      type: DataTypes.ENUM,
      values: ['Add', 'Deduct'],
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'credit',
    underscored: true,
    name: {
      singular: 'credit',
      plural: 'credits',
    },
  });

  Credit.associate = models => {
    models.Credit.belongsTo(models.CreditUser, { foreignKey: 'userId', targetId: 'id' });
  };
  return Credit;
};
