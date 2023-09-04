const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const config = require('./config')

const userRegister = require("./controller/user/register")
const userLogin = require("./controller/user/login")
const userUpdate = require("./controller/user/updateProfile")
const userbloodReq = require("./controller/user/bloodReq")
const userDonateReq = require("./controller/user/donateReq")

const empRegister = require("./controller/employee/register")
const empLogin = require("./controller/employee/login")
const empUpdateStock = require("./controller/employee/updateStock")
const empBloodReqHandeler = require("./controller/employee/bloodReqHandeler")
const empDonationHandeler = require("./controller/employee/donateReqHandeler")
const empDonnerRecord = require("./controller/employee/donnerRecords")


const app = express()

// used for logging on the console
app.use(morgan('combined'))
app.use(express.json())
app.use(cors('*'))
app.use(express.static('uploads'))




// express middleware to check if user exists and verify JWT
app.use((request, response, next) => {
  if (request.url == '/user/login' || request.url == '/user/register' || request.url =='/emp/login' || request.url =='/emp/register' ||  request.url == '/user/forgotPassword' ||  request.url == '/user/resetPassword') {
    // token is not required
    next();
  } else {
    // get the JWT token from the Authorization header
    const token = request.headers['authorization'];
    console.log(`token = ${token}`);
    console.log("token at mid "+ token)

    if (token == null) {
      response.status(400).json({ status: 'error', message: 'Missing token' });
      return;
    }

    try {
      // decode the token and get the payload
      const payload = jwt.decode(token, config.secret);

      // add the info to the request so that every API can use the payload
      request.payload = payload;

      next();
    } catch (ex) {
      response.status(401).json({ status: 'error', message: 'Invalid token' });
      console.log(error);
    }
  }
});



app.use('/user',userRegister)
app.use('/user',userLogin)
app.use('/user',userUpdate)
app.use('/user',userbloodReq)
app.use('/user',userDonateReq)


app.use('/emp',empRegister)
app.use('/emp',empLogin)
app.use('/emp',empUpdateStock)
app.use('/emp',empBloodReqHandeler)
app.use('/emp',empDonationHandeler)
app.use('/emp',empDonnerRecord)






app.listen(4000, "0.0.0.0", () => {
  console.log("Server started at port 4000")
})
