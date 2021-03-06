const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then( createdUser => {
        const token = jwt.sign(
          { email: createdUser.email, userId: createdUser._id},
          'secret_this_should_be_longer',
          { expiresIn: '1h' }
        );
        res.status(200).json({
          message: 'User added successfully',
          token: token,
          expiresIn: 3600,
          userId: createdUser._id
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Invalid authentication crendentials!'
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result =>{
      if(!result) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      })
    });
});

module.exports = router;
