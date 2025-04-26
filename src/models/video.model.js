
import mongoose from "mongoose";
const Schema = mongoose.Schema

const Video = new Schema({
  videoFile:{
    type:String,
    required:true,
  },
  thumbnail:{
    type:String,
    required:true,
  },
  owner:{
    type:Schema.ObjectId,
    ref:"User"
  },
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  duration:{
    type:Number,
    required:true
  },
  views:{
    type:Number,
    required:true,
    default:0
  },
  isPublished:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true 
})
export const Videomodel = mongoose.model("Video",Video)