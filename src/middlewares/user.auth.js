import User from "../models/User.js";

export const authMiddleware = async(req, res, next) =>{
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