import mongoose from "mongoose";
const Schema = mongoose.Schema

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
  fullname:{
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

UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next()
  
  this.password=bcrypt.hash(this.password,10)
  next()
})

export const User = mongoose.model("User",UserSchema)