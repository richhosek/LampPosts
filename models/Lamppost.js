const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Trip model
class Lamppost extends Model { }

// create fields/columns for Lamppost model
Lamppost.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        needsPrimer: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lat: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        lng:  {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING,
        },
        preppedBy: DataTypes.STRING,
        paintedBy: DataTypes.STRING,
        inspectedBy: DataTypes.STRING,
        damage: DataTypes.STRING
    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'lamppost'
    }
);

module.exports = Lamppost;
