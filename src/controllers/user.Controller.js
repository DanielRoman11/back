import { createJWT } from "../helpers/tokens.js";
import User from "../models/User.js";

export const registerForm = (req, res) =>{ res.render('auth/register') };
export const register = async(req, res)=>{
  try {
    const { username, email, password} = req.body;
    
    if(username === "" || email === "" || password === undefined){
      return res.render('auth/register', {
        errors: {error: 'All fields required'},
        username,
        email
      })
    }
  
    const user = await User.findOne({where: {email}})
    if(user) {
      return res.render('auth/register', {
        errors: {error: 'User already registered'}
      })
    }
  
    await User.create({
      username,
      email,
      password
    })
      .then(()=>{
        res.redirect('/auth/login')
      })
  } catch (error) {
    throw new Error(error)
  }
}

export const loginForm = (req, res) =>{ res.render('auth/login') }
export const login = async(req, res) =>{
  try {
    const { email, password } = req.body;

    const checkboxValue = req.body.miCheckbox === 'on' ? true : false;

    if(email === "" || password === undefined){
      return res.render('auth/login', {
        errors: {error: 'All fields required'},
        email
      })
    }
  
    await User.findOne({where: {email}})
      .then(async user => {
        if(!user) return res.render('auth/login', {
          errors: {error: 'User not found'},
          email
        })
        
        if(!await user.validPassword(password)){
          return res.render('auth/login',{
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
}

export const profilePage = (req, res) =>{
  const user = req.auth;
  res.render('profile/profileSettings',{
    user
  })
}
