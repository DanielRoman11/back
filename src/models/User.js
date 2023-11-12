import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";
import db from "../config/database.js";

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


export default User;