const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')

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
  checkAuth,
  multer({storage:storage}).single('image'),
  (req, res, next) =>{
    const url = req.protocol + '://' + req.get('host');
    const bank = new Bank({
      name: req.body.name,
      value: req.body.value,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    });

    bank
      .save()
      .then(createdBank => {
        res.status(201).json({
          message: 'Bank added successfully.',
          bank:{
            ...createdBank,
            id: createdBank._id
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Creating a bank failed!'
        })
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
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Bank(s) failed!'
      })
    });

});

router.delete(
  '/:id',
  checkAuth,
  (req, res, next) =>{
  Bank.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then((result) => {
      if(result.n > 0) {
        res.status(200).json({
          message: 'Deletion successful.'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized.'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting Bank failed!'
      })
    });

});

router.put(
  '/:id',
  checkAuth,
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
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Bank.updateOne( { _id: req.params.id, creator: req.userData.userId }, bank)
      .then(result => {
        if(result.nModified > 0) {
          res.status(200).json({
            message: 'Update successful.'
          });
        } else {
          res.status(401).json({
            message: 'Not authorized.'
          });
        }
    })
    .catch( error => {
      res.status(500).json({
        message: "Couldn't update bank!"
      })
    });
});

router.get('/:id', (req, res, next) => {
  Bank.findById(req.params.id)
  .then(bank => {
    if(bank){
      res.status(200).json(bank);
    }else{
      res.status(404).json({message: 'Bank not found.'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching Bank failed!'
    });
  });
});

module.exports = router;
