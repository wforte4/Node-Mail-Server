const config = require('./common/config/env.config.js');
const path = require("path");
var fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
var serveIndex = require('serve-index')

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');
const TasksRouter = require('./tasks/routes.config')
const ThoughtRouter = require('./thought/routes.config')
const ProjectsRouter = require('./projects/routes.config')
const ContactRouter = require('./contact/routes.config')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
})
   
var upload = multer({ storage: storage })

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use('/ftp', express.static('uploads'), serveIndex('uploads', {'icons': true}))
app.use(bodyParser.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
TasksRouter.routesConfig(app);
ProjectsRouter.routesConfig(app);
ContactRouter.routesConfig(app);
ThoughtRouter.routesConfig(app);

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      return res.send(file)
    
});

app.post('/uploadmultiple', upload.array('myFiles', 10), (req, res, next) => {
    var file = req.files
    if (!file) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file)
});

var dirPath = path.join(__dirname, 'uploads');

app.get('/getallimages', (req, res) => {

  var newimages = [];

  fs.readdirSync(dirPath).forEach(function (file) {
      newimages.push(file)
  });

  if(newimages) {
    return res.status(200).send({images: newimages})
  } else {
    return res.status(404).end()
  }

});

app.delete('/removeimage/:image', (req, res) => {
  try {
    fs.unlinkSync(dirPath + "/" + req.params.image)
  } catch(e) {
    console.log(e)
  }
  return res.status(200).end()
});

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
