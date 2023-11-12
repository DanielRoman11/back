import express from 'express';
import path from 'path';
import * as url from 'url';
import cookieParser from 'cookie-parser';
import db from './src/config/database.js';
import userRoutes from "./src/routes/user.Router.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.listen(3000, ()=>{
  console.log('SERVER ON PORT: ', 3000);
})

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
app.use(express.static('public'));
app.use(express.static('../node_modules/bootstrap'));

app.use('/auth', userRoutes)

app.set('view engine', 'pug')
app.set('views', 'views');