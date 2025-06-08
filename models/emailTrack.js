'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailTrack extends Model {
    static associate(models) {
      // define association here
    }
  }

  EmailTrack.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email_sent_to: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email_sent_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'EmailTrack',
      tableName: 'email_track',
      timestamps: true, // adds createdAt and updatedAt
    }
  );

  return EmailTrack;
};
