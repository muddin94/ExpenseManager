const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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
  const bank = req.body;
  console.log(bank);
  res.status(201).json({
    message: 'Bank added successfully.'
  });
});

app.get('/api/banks',(req, res, next) =>{
  const banks = [
    {
      id: 'abc123',
      name: 'First Server-Side Bank',
      value: 'This is coming from the nodejs server.'
    },
    {
      id: 'def456',
      name: 'Second Server-Side Bank',
      value: 'This is coming from the nodejs server again.'
    }
  ]

  res.status(200).json({
    message: 'Banks fetched successfully',
    banks: banks
  });

});

module.exports = app;
