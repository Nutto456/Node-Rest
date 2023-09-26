const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const dbUrl = 'postgres://postgres:password@localhost:5432/PGBooks';
const sequelize = new Sequelize(dbUrl);