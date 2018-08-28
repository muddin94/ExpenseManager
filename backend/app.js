const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Bank = require('./models/bank');

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

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/banks', (req, res, next) =>{
  const bank = new Bank({
    name: req.body.name,
    value: req.body.value
  });
  console.log(bank);
  bank.save();
  res.status(201).json({
    message: 'Bank added successfully.'
  });
});

app.get('/api/banks',(req, res, next) =>{

  Bank.find()
    .then(documents => {
      res.status(200).json({
        message: 'Banks fetched successfully',
        banks: documents
      });
    });

});

module.exports = app;
