import jwt from "jsonwebtoken";

const SECRET_KEY = 'jwtsecret';

export const createJWT = ({id}, check) =>{
  return jwt.sign({id}, SECRET_KEY, {
    expiresIn: check ? '3d' : '1d',
  })
}