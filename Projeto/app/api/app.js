var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
const {v4 : uuidv4} = require('uuid')
var User = require('./models/user')
require('dotenv').config()


// db connection
var mongoDB = process.env.MONGODB_URI || 'mongodb://mongodb:27017/diario'
mongoose.connect(mongoDB)
var connection = mongoose.connection
connection.on('error', console.error.bind(console, 'Erro na conexão ao MongoDB'))
connection.once('open', () => console.log('Conexão ao MongoDB realizada com sucesso'))

// passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// criar unique username
async function generateUniqueUsername(displayName) {
    // tirar espaços do username
    let base = displayName.replace(/\s+/g, '').toLowerCase();
    let username = base;
    let counter = 1;
  
    // verifica se já existe na bd
    while (await User.findOne({ username })) {
      username = base + counter;
      counter++;
    }
    return username;
  }

// meter credenciais em .env e nao dar commit no git!!
const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
},
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile.id)
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      const username = await generateUniqueUsername(profile.displayName);
      user = await User.create({
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0].value,
        username: username,
        level: 'user',
        creationDate: new Date()
      });
    }
    return cb(null, user);
  }
));

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile.id)
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      const username = await generateUniqueUsername(profile.displayName);
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0].value,
        username: username,
        level: 'user',
        creationDate: new Date()
      });
    }
    return cb(null, user);
  }
));


var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');
var filesRouter = require('./routes/files');
var commentsRouter = require('./routes/comments');
var adminRouter = require('./routes/admin')
var noticiasRouter = require('./routes/noticias')

var app = express();

app.use(session({
    genid: req => {
        return uuidv4()
    },
    secret: 'Diario_Pessoal_Secreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter)
app.use('/api/files',filesRouter)
app.use('/api/comments',commentsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/noticias', noticiasRouter)


module.exports = app;
