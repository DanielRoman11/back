import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req, res, next) =>{
  const { _token } = req.cookies;

  const decoded = new Promise((resolve, reject) => {
    if(_token){
      jwt.verify(_token, process.env.JWT_SECRET, (err, decoded) =>{
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
      if(!user) return res.redirect('/auth/register');

      req.auth = user;

      next();
    })
    .catch(err =>{
      console.error(err);
      res.redirect('/auth/register');
    });
}