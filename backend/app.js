const express = require('express');

const app = express();

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

app.use('/api/banks',(req, res, next) =>{
  const banks = [
    {
      id: 'abc123',
      name: 'First Server-Side Post',
      value: 'This is coming from the nodejs server.'
    },
    {
      id: 'def456',
      name: 'Second Server-Side Post',
      value: 'This is coming from the nodejs server again.'
    }
  ]

  res.status(200).json({
    message: 'Banks successfully',
    banks: banks
  });

});

module.exports = app;
