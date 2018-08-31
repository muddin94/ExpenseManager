const express = require("express");

const Bank = require('../models/bank');

const router = express.Router();

router.post("", (req, res, next) =>{
  const bank = new Bank({
    name: req.body.name,
    value: req.body.value
  });

  bank.save()
    .then(createdBank => {
      res.status(201).json({
        message: 'Bank added successfully.',
        bankId: createdBank._id
      });
    });
});

router.get("",(req, res, next) =>{

  Bank.find()
    .then(documents => {
      res.status(200).json({
        message: 'Banks fetched successfully.',
        banks: documents
      });
    });

});

router.delete("/:id",(req, res, next) =>{
  Bank.deleteOne({_id:req.params.id})
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Bank deleted.'
      });
  });

});

router.put("/:id", (req, res, next) => {
  const bank = new Bank({
    _id: req.body.id,
    name: req.body.name,
    value: req.body.value
  });
  Bank.updateOne( { _id: req.params.id}, bank)
    .then(result => {
      res.status(200).json({message: 'Update successful.'});
    });
});

router.get("/:id", (req, res, next) => {
  Bank.findById(req.params.id).then(bank => {
    if(bank){
      res.status(200).json(bank);
    }else{
      res.status(404).json({message: 'Bank not found.'});
    }
  })
});

module.exports = router;
