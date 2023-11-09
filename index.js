import exp from 'constants';
import express from 'express';
import { DataTypes, Sequelize, UUIDV4 } from 'sequelize';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path';
import * as url from 'url';
import cookieParser from 'cookie-parser';
import { error } from 'console';


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const SECRET_KEY = 'jwtsecret';

const app = express();
app.listen(3000, ()=>{
  console.log('SERVER ON PORT: ', 3000);
})

const db = new Sequelize('postgrestdb','daker','S3cret',{
  dialect:'postgres',
  host:'localhost',
  port: 5432
})

const User = db.define('users', {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  hooks:{
    beforeCreate: async function (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt)
    }
  },
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

await db.authenticate()
  .then(async()=>{
    console.log('Database running');
  })
  .catch(err =>{
    console.error(err);
  });

app.locals.basedir = path.join(__dirname, 'views');

app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', 'views');

app.get('/register', (req, res) =>{
  res.render('register')
})
app.post('/register', async(req, res)=>{
  try {
    const { username, email, password} = req.body;
    
    if(username === "" || email === "" || password === undefined){
      return res.render('register', {
        errors: {error: 'All fields required'},
        username,
        email
      })
    }
  
    const user = await User.findOne({where: {email}})
    if(user) {
      return res.render('register', {
        errors: {error: 'User already registered'}
      })
    }
  
    await User.create({
      username,
      email,
      password
    })
      .then(()=>{
        res.redirect('/login')
      })
  } catch (error) {
    throw new Error(error)
  }
})

const createJWT = ({id}, check) =>{
  return jwt.sign({id}, SECRET_KEY, {
    expiresIn: check ? '3d' : '1d',
  })
}

app.get('/login', (req, res) =>{
  res.render('login');
})
app.post('/login', async(req, res) =>{
  try {
    const { email, password } = req.body;

    const checkboxValue = req.body.miCheckbox === 'on' ? true : false;

    if(email === "" || password === undefined){
      return res.render('login', {
        errors: {error: 'All fields required'},
        email
      })
    }
  
    await User.findOne({where: {email}})
      .then(async user => {
        if(!user) return res.render('login', {
          errors: {error: 'User not found'},
          email
        })
        
        if(!await user.validPassword(password)){
          return res.render('login',{
            errors: {error: 'Password incorrect!'},
            email
          })
        }
        const token = createJWT(user, checkboxValue);
        
        res.cookie('_token', token).redirect('/')
      });
  } catch (error) {
    throw new Error(error)
  }
})

const authMiddleware = async(req, res, next) =>{
  const { _token } = req.cookies;

  const decoded = new Promise((resolve, reject) => {
    if(_token){
      jwt.verify(_token, SECRET_KEY, (err, decoded) =>{
        if(err) reject(err);
        else resolve(decoded)
      })
    }
    else{
      reject(new Error('Token not found'))
    }
  });

  decoded
    .then(async ({ id }) =>{

      const user = await User.findByPk(id);
      if(!user) return res.redirect('/register');

      req.auth = user;

      next();
    })
    .catch(err =>{
      console.error(err);
      res.redirect('/register');
    });
}

app.get('/', authMiddleware, (req, res) =>{
  const user = req.auth;
  res.render('index',{
    username: user.username
  })
})
