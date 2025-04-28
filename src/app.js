import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(cors({
  origin : process.env.CORS_ORIGIN,
  credentials:true 
}))

//we are limiting the data that can be taken by url,json,etc
// Express middleware to parse JSON bodies sent by frontend.	To prevent very large payloads from attacking your server (DDoS).
app.use(express.json({ limit: " 16kb" }))
//Express middleware to parse URL-encoded bodies (like data submitted by HTML forms). | extended: true: ->	Allows parsing of nested objects inside URL-encoded forms.
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
//Serves static files like images, CSS, JavaScript from a public/ folder
app.use(express.static('public'))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'

app.use('/api/v1/users',userRouter)

export { app }