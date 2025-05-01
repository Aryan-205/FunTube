import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const subscriptionSchema = new Schema({
    subscription:{
      type:ObjectId,
      ref:'User'
    },
    channel:{
      type:ObjectId,
      ref:'User'
    }
  },{ timestamps:true })

export const Subscription = mongoose.model('Subscription',subscriptionSchema) 