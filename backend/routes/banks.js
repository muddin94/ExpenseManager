const express = require('express');
const multer = require('multer');
const Bank = require('../models/bank');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  '',
  multer({storage:storage}).single('image'),
  (req, res, next) =>{
    const url = req.protocol + '://' + req.get('host');
    const bank = new Bank({
      name: req.body.name,
      value: req.body.value,
      imagePath: url + '/images/' + req.file.filename
    });

    bank.save()
      .then(createdBank => {
        res.status(201).json({
          message: 'Bank added successfully.',
          bank:{
            ...createdBank,
            id: createdBank._id
          }
        });
    });
  }
);

router.get('',(req, res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const bankQuery = Bank.find();
  let fetchedBanks;
  if(pageSize && currentPage){
    bankQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  bankQuery
    .then(documents => {
      fetchedBanks = documents;
      return Bank.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Banks fetched successfully.",
        banks: fetchedBanks,
        maxBanks: count
      });
    });

});

router.delete('/:id',(req, res, next) =>{
  Bank.deleteOne({_id:req.params.id})
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Bank deleted.'
      });
  });

});

router.put(
  '/:id',
  multer({storage:storage}).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const bank = new Bank({
      _id: req.body.id,
      name: req.body.name,
      value: req.body.value,
      imagePath: imagePath
    });
    console.log(bank)
    Bank.updateOne( { _id: req.params.id}, bank)
      .then(result => {
        res.status(200).json(
          {
            message: 'Update successful.'
          }
      );
    });
});

router.get('/:id', (req, res, next) => {
  Bank.findById(req.params.id).then(bank => {
    if(bank){
      res.status(200).json(bank);
    }else{
      res.status(404).json({message: 'Bank not found.'});
    }
  })
});

module.exports = router;
