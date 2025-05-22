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

    if(!commentId){
        throw new ApiError(400, "commentId not foundj")
    }

    const userId = req.user.id

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "Missing or Invalid comment id");
    }

    const existingLike =  await Like.findById({
        comment:commentId,
        likedBy:userId
    })
    let liked;

    if(existingLike){
        const deletedCommentLike =  await existingLike.deleteOne()

        if (!deletedCommentLike) {
            throw new ApiError(500, "Failed to unlike the comment");
        }
        liked = false;
    } else {
        const likedComment =  await Like.create({
            comment:commentId,
            likedBy:userId
        })
        if(likedComment){
            throw new ApiError(400, "Failed to like the comment")
        }
        liked = true;
    }

    const totalLike =  await Like.countDocuments({comment: commentId})

    return res.status(200).json(
        new ApiResponse(200,{ commentId, liked, totalLike },"comment liked successfully")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!tweetId){
        throw new ApiError(400, "tweetId not foundj")
    }

    const userId = req.user.id

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Missing or Invalid tweet id");
    }

    const existingLike =  await Like.findById({
        tweet:tweetId,
        likedBy:userId
    })
    let liked;

    if(existingLike){
        const deletedTweetLike =  await existingLike.deleteOne()

        if (!deletedTweetLike) {
            throw new ApiError(500, "Failed to unlike the tweet");
        }
        liked = false;
    } else {
        const likedTweet =  await Like.create({
            tweet:tweetId,
            likedBy:userId
        })
        if(likedTweet){
            throw new ApiError(400, "Failed to like the tweet")
        }
        liked = true;
    }

    const totalLike =  await Like.countDocuments({tweet: tweetId})

    return res.status(200).json(
        new ApiResponse(200,{ tweetId, liked, totalLike },"tweet liked successfully")
    )
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