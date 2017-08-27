var express = require('express'); //(15)
var router = express.Router(); //(15)
var Photo = require('../models/Photo'); //(15)
var path = require('path'); //(15)
var fs = require('fs-extra'); //(15)
var join = path.join; //(15)
var multer = require('multer');
router.get('/',function(){
  return function(req, res, next){
    var id = req.params.id;
    console.log('photos.js router.get における req.params.idは');
    console.log(id);  
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join('public/', photo.path);
//      res.download(path, photo.name+'.jpeg');
    console.log('photos.js router.get における pathは');
    console.log(path);  
      res.download(path);
    });
  };
});
module.exports = router ; //(18)
