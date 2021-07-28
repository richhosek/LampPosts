const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Trip model
class Volunteer extends Model { }

// create fields/columns for Volunteer model
Volunteer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // scout or adult
        type: {
            type: DataTypes.STRING,
            default: "scout"
        },
        // indicates whether the volunteer is currently working
        // so they can only make changes IF they are currently active
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            default: "inactive"
        },

    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'vounteer'
    }
);

module.exports = Volunteer;
