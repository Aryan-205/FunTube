import mongoose from "mongoose";

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const TweetSchema = new Schema({
  owner:{
    type:ObjectId,
    ref:"User"
  },
  context:{
    type:String,
    required:true
  }
},{
  timestamps:true
})

export const Tweet = mongoose.model('Tweet',TweetSchema)