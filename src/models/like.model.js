import mongoose from "mongoose";

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const LikeSchema = new Schema({
  comment:{
    type:ObjectId,
    ref:"Comment"
  },
  video:{
    type:ObjectId,
    ref:"Video"
  },
  likedby:{
    type:ObjectId,
    ref:"User"
  },
  tweet:{
    type:ObjectId,
    ref:"Tweet"
  }
},{
  timestamps:true
})

export const Like = mongoose.model('Like',LikeSchema)