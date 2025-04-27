//DB is in another continent - Hitesh sir
// this is the database file not the models so we dont have the schema here
//this file just contain the connection function it doesnt connect to db

import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

//connnect to mongodb
const connectDB = async() => {
  try {
    //need to use await as getting the data from db may take time
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME }`)
    console.log(`\n MongoDB connected !! DB HOST : ${ connectionInstance.connection.host }`)
  } catch (error) {
    console.log("MongoDB connection error",error);
    //immediate return with error
    process.exit(1)
  }
}
export default connectDB