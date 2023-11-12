import User from "../models/User.js";

export const dashboard = async(req, res) =>{
  const user = req.auth;
  const users = await User.findAll();

  res.render('index',{
    username: user.username,
    users: users
  })
}

export const postDashboard = async(req, res) =>{
  const user = req.auth;
  const users = await User.findAll();
  
  res.render()
}
