const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const User = require('./models/user')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const errorController = require('./controllers/error');
const session = require('express-session')
const mongoDbstore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const csrfProtection = csrf()
const flash = require('connect-flash')
const multer = require('multer')
const isAuth = require('./middleware/is-auth')

const shopController = require('./controllers/shop');



const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-evxw4.mongodb.net/${process.env.db}`
const app = express();
const store = new mongoDbstore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/')
  },
  filename: (req, file, cb) =>{
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
app.set('view engine', 'ejs');
app.set('views', 'views');

//const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '')))
app.use(session({secret: 'My secret', resave: false, saveUninitialized: false, store: store}))

app.use(flash())



app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => {
      throw new Error(err)
    });
  
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  
  next()
})

app.post('/create-order', isAuth, shopController.postOrder);
app.use(csrfProtection)
app.use((req, res, next) => {
  
  res.locals.csrfToken = req.csrfToken()
  next()
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
  console.log('connected!')  
  app.listen(process.env.PORT || 2100)
}).catch(err => console.log(err))

