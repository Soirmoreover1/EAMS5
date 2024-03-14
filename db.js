const dotenv =require('dotenv');
const createConnection =require('mysql');
dotenv.config();
const db = createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: "eams5"
})
db.connect(function(err) {
    if(err) {
        console.log("connection error")
    } else {
        console.log("Connected successfully")
    }
})
module.exports = db;