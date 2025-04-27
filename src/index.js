import dotenv from 'dotenv'

import express from 'express'
import connectDB from './db/index.js'

const app = express()

dotenv.config({
  path: './env'
})

connectDB() 
  .then(() => {
    app.listen(process.env.PORT || 8000 ,() => {
      console.log(`Server is running at Port: ${process.env.PORT }`)
    })
  })
  .catch(err => {
    console.log("MongoDB connection failed",err)
  })