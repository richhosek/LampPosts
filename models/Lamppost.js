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
        lamppostId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        needsPrimer: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            default: "new"
        },

        lat: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lng:  {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING,
        },
        preppedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        preppedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paintedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paintedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        inspectedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        inspectedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        damage: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'lamppost'
    }
);

module.exports = Lamppost;
