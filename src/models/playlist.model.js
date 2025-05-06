import mongoose from "mongoose";

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const PlaylistSchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  discription:{
    type:String,
    required:true
  },
  owner:{
    type:ObjectId,
    ref:"User"
  },
  video:[
    {
      type:ObjectId,
      ref:'Video'
    }
  ]
},{
  timestamps:true
})

export const Playlist = mongoose.model('Playlist',PlaylistSchema)