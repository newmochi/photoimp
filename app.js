var express = require('express');
var multer = require('multer') ; //(21)
var routes = require('./routes'); //⑨-1
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var shashin = require('./routes/shashin');
var photos = require('./routes/photos');//⑨-2

var app = express();
var basicAuth = require('basic-auth-connect');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* 基本認証追加 */
app.use(basicAuth('username', 'password'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('photos', __dirname + '/public/photos') ; //(12)

/* ルートはこの際カット */
// app.use('/', index); //⑨-3

/* (14)photosは上記requireでroutes/photos.jsである。
   この構文かつphotos.jsでroute.ほにゃららで複数のルート設定
   をできる。
   参考URLは、http://expressjs.com/ja/guide/migrating-4.html
   */
app.use('/photos', photos);

/* 2016.12.3 本のようにapp.useを使用せず、photo/ではなくphotos/
   のrouteの１つとした。よって、routes/photos.jsにのみdownload
   ミドルウェアキックを記述した
app.get('/photo/:id/download',photos.download(app.get('photos')));
*/

/* 効いてない
app.post('/photos/upload', uuuu.single('photo'),function(req,res,next){
  console.log("fff");
  console.log(req.file);
  var target_path = 'uploads/' + req.file.originalname;
  var src = fs.createReadStream(req.file.path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { res.render('complete'); });
  src.on('error', function(err) { res.render('error'); }); 
  res.redirect('/');
});
*/

// NG app.use(multer({ dest: './photos/upload' })); // (21)
//app.use('/users', user.list);
// app.use('/upload',photos); //routes側でget,postのはず //(14)
//app.use('/upload', photos.form);
//app.use('/upload', photos.submit(app.get('photos')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
