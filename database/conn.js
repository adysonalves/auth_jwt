const { Sequelize } = require('sequelize');

const conn = new Sequelize('sqlite::memory:');

module.exports = conn;
