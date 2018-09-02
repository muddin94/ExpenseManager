const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const banksRoutes = require('./routes/banks');

const app = express();

mongoose.connect('mongodb+srv://root:N3gr8F18PBadnkC7@cluster0-mo2we.mongodb.net/expenseManager?retryWrites=true')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() =>{
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/banks', banksRoutes);

module.exports = app;
