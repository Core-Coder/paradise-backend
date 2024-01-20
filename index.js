const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const Register = require('./handler/handleRegis.js');
const Login = require('./handler/handleLogin.js')
const refreshToken = require('./handler/refreshToken.js')
const Logout = require('./handler/handleLogout.js')
const getUsers = require('./getUsers.js');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const verifyToken = require('./middleware.js')
const ProductRoute = require('./router/ProductRoute.js');
dotenv.config()

app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use(ProductRoute)
app.use('/images', express.static('public/images'));

app.post('/user', verifyToken, getUsers)
app.post('/register', Register);
app.post('/login', Login)
app.get('/token', refreshToken)
app.delete("/logout", verifyToken, Logout)



app.listen(3000, () =>{
    console.log("berhasil terhubung")
})



