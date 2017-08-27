require('date-utils');
var express = require('express'); //(15)
var router = express.Router(); //(15)
var Photo = require('../models/Photo'); //(15)
var path = require('path'); //(15)
var fs = require('fs-extra'); //(15)
var join = path.join; //(15)
var multer = require('multer');
var uu = multer({ dest: 'public/images/' });
/* The <NAME> you use in multer's upload.single(<NAME>) function
 must be the same as the one 
 you use in <input type="file" name="<NAME>" ...>.  */
var type = uu.single('photo[image]'); //ファイル名は同じに

/* (16) */
router.get('/list' ,  function(req, res, next){
  Photo.find({}, function(err, photos){
    if (err) return next(err);
    res.render('photos', {
      title: 'Photos',
      photos: photos
    });
  });
});
router.get('/upload', function(req, res){
  res.render('photos/upload', {
    title: 'Photo upload' 
  });
});
/* (17) */
router.post('/upload', type,function (req,res,next) {
//app2.post('/photos/upload', type,function (req,res,next) {
  console.log(req.file);
  var orgfname = req.file.originalname ;
  /* uploadされた__dirnameからの相対パス
     __dirname + orgfnameが本当のフルパス */
  var tmp_path = req.file.path;
//  var target_path = 'uploads/' + orgfname ;  //public配下しか見えないからNG

  var dt = new Date();
  var formatted = dt.toFormat("YYYY/MM/DD/HH24/MI/SS");
  var pubdir = 'public/' ;
  var target_dir = 'uploads/' + formatted ;
  var target_path = target_dir + '/' + orgfname;
  
  /* テキストフィールドのファイル名、なければOS上本のファイル名 */
  var name = req.body.photo.name || orgfname ;
  /** A better way to copy the uploaded file. **/
/*
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { res.render('complete'); });
  src.on('error', function(err) { res.render('error'); }); 
*/
  var pub_target_dir = pubdir + target_dir;
  var pub_target_path = pubdir + target_path;
  fs.mkdirs(pub_target_dir,function(err){ //fs-extra
    if (err) return next(err);
    fs.rename(tmp_path,pub_target_path,function(err){
      if (err) return next(err);
      Photo.create({
        name: name,
        path: target_path
      }, function(err) {
        if (err) return next(err);
        res.redirect('/photos/list');
      });
    });
  });
});

/* 2016.12.3 本のようにapp.useを使用せず、photo/ではなくphotos/
   のrouteの１つとした。よって、routes/photos.jsにのみdownload
   ミドルウェアキックを記述した。
   かつパスも全部DBのフィールドに入れてしまったので本のように
   dirを渡す処理もカット。汎用性は下がってしまうかもしれないが。*/

router.get('/download/:id', function(req, res){
  var id = req.params.id;
  console.log('photos.js router.get における req.params.idは');
  console.log(id);  
  Photo.findById(id, function(err, photo){
    if (err) return next(err);
    var path = join('public/', photo.path);
    console.log('photos.js router.get における pathは');
    console.log(path);  
    res.download(path);
  });
});

module.exports = router ; //(18)
