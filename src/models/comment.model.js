import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const CommentSchema = new Schema({
  context:{
    type:String
  },
  video:{
    type:ObjectId,
    ref:'Video'
  },
  owner:{
    type:ObjectId,
    ref:'User'
  }
},{
  timestamps:true
})

export const Comment = mongoose.model('Comment',CommentSchema)