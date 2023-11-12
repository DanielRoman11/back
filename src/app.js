import express from 'express';
import path from 'path';
import * as url from 'url';
import cookieParser from 'cookie-parser';
import db from './config/database.js';
import userRoutes from "./routes/user.Router.js";
import indexRoutes from './routes/index.Router.js';

const app = express();

await db.authenticate()
  .then(async()=>{
    console.log('Database running');
  })
  .catch(err =>{
    console.error(err);
  });

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
app.locals.basedir = path.join(__dirname, 'views');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.static('../node_modules/bootstrap'));

app.use('/auth', userRoutes);
app.use('/', indexRoutes);


export default app;