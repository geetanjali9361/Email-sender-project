'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailContent extends Model {
    static associate(models) {
      // define association here
    }
  }

  EmailContent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EmailContent',
      tableName: 'email_content',
      timestamps: true, // adds createdAt and updatedAt
    }
  );

  return EmailContent;
};
