import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'


// tokens

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found during token generation")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken, refreshToken}

  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

//register

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
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
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

//login

const loginUser = asyncHandler(async (req, res)=>{
  const {username, email, password} = req.body

  if(!username && !email){
    throw new ApiError(400,"Username and email is required")
  }
  const user = await User.findOne({
    $or: [{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"User doesn't exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401,"Invalid User Credentials")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password, -refreshToken")

  const options = {
    secure: true,
    httpOnly: true
  }

  return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
          user: accessToken, refreshToken, loggedInUser
        },
        "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler( async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },{
      new: true
    }
  )

  const options = {
    secure: true,
    httpOnly: true
  }

  return res
  .status(200)
  .clearCookie('accessToken',options)
  .clearCookie('refreshToken',options)
  .json( new ApiResponse(200,{}, "User logged out"))
})

export {
  registerUser,
  loginUser,
  logoutUser
} 