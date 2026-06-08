import mysql2 from 'mysql2'
import dotenv from 'dotenv' 
dotenv.config({path: '/home/kayo/Documents/projetu_zero_papiers/backend/.env'})

export const pool = mysql2.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()