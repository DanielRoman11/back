import { Sequelize } from "sequelize";

const db = new Sequelize('postgrestdb','daker','S3cret',{
  dialect:'postgres',
  host:'localhost',
  port: 5432
})

export default db;