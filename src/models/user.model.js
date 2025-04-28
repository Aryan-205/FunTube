import mongoose from "mongoose";
const Schema = mongoose.Schema

import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    indes:true
  },
  fullName:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type:String, //cloudnary url
    required:true
  },
  coverImage:{
    type:String, 
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    index:true
  },
  refreshToken:{
    type:String,
  },
  watchHistory:[
    {
      type:Schema.ObjectId,
      ref:'Videos'
    }]
},{
  timestamps:true 
})

//if password is ever modified then the new password is hashed by this, even when first setup
UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next()
  
  this.password= await bcrypt.hash(this.password,10)
  next()
})

//checking the password
UserSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

//we are enterign the data for the token which we used to do in the sign up/sign in section we are doing it here directly
//expire time should be kept in curly braces

//access token are short lived but refresh token are long lived
UserSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
UserSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const User = mongoose.model("User",UserSchema)