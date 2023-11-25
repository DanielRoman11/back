import User from "../models/User.js";

export const home = async(req, res) =>{
  const user = req.auth;
  const users = await User.findAll();

  res.render('home',{
    username: user.username,
    users: users
  })
}
