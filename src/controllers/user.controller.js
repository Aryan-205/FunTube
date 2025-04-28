import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req, res)=>{
  
  const {username, email, fullName, password} = req.body 
  if(
    [username,password,email,fullName].some((field)=>
      field?.trim()===''
    )
  ){
    throw new ApiError(400,"all fields are required")
  }

  const existingUser = await User.findOne({
    $or: [{ username },{ email }]
  })
  if(existingUser){
    throw new ApiError(409,"User with email or username already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
    coverImageLocalPath = req.files.coverImage.path;
  }

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400,"Avatar is required")
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username:username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || ''
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500,"Something went wrong in registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)
})

export {registerUser} 