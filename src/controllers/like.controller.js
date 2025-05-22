import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!videoId){
        throw new ApiError(400, "videoId not foundj")
    }

    const userId = req.user.id

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Missing or Invalid video id");
    }

    const existingLike =  await Like.findById({
        video:videoId,
        likedBy:userId
    })
    let liked;

    if(existingLike){
        const deletedVideoLike =  await existingLike.deleteOne()

        if (!deletedVideoLike) {
            throw new ApiError(500, "Failed to unlike the video");
        }
        liked = false;
    } else {
        const likedVideo =  await Like.create({
            video:videoId,
            likedBy:userId
        })
        if(likedVideo){
            throw new ApiError(400, "Failed to like the video")
        }
        liked = true;
    }

    const totalLike =  await Like.countDocuments({video: videoId})

    return res.status(200).json(
        new ApiResponse(200,{ videoId, liked, totalLike },"video liked successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}