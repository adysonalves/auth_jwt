const { DataTypes } = require('sequelize');
const conn = require('../database/conn');

const User = conn.define('user', {
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwd:{
        type: DataTypes.STRING,
        required: true
    }
});


module.exports = User;