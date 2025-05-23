import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { useDeferredValue } from "react"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {context} = req.body
    if(!context){
        throw new ApiError(400,"context not found")
    }

    const userId = req.user.id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"userId not found")
    }
    
    const tweet = await User.create({
        context,
        owner:userId
    })
    if(!tweet){
        throw new ApiError(400,"tweet creation unsuccessful")
    }

    return res.status(200).json(
        new ApiResponse(200,tweet,"tweet posted successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {

    // Have to add the pipeline

    // TODO: get user tweets
    const userId = req.user.id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"user not found")
    }

    const allTweet = await Tweet.findById(t=>t.owner == userId)
    if(!allTweet){
        throw new ApiError(400,"tweets not found")
    }

    return res.status(200).json(
        new ApiResponse(200,allTweet,"all tweets extracted successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId,newContext} = req.body
    if(!tweetId){
        throw new ApiError(400,"tweet not found")
    }
    if(newContext.trim()==''){
        throw new ApiError(400,"enter the context")
    }

    const userId = req.user.id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"user not found")
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "No such tweet found");
    }

    if (!tweet.owner.equals(userId)) {
        throw new ApiError(403, "You are not allowed to update this tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
        $set: {
            content,
        },
        },
        { new: true }
    );

    if(!updatedTweet){
        throw new ApiError(400,"tweet not updated")
    }

    res.status(200).json(
        new ApiResponse(200,updatedTweet,"tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.body
    if(!tweetId){
        throw new ApiError(400,"tweet not found")
    }

    const userId = req.user.id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"user not found")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet.owner.equals(userId)) {
        throw new ApiError(403, "You are not allowed to delete this tweet");
    }

    const deletedTweet = await Tweet.findByIdAndRemove(tweetId)
    if(!tweet){
        throw new ApiError(400,"tweet not updated")
    }

    res.status(200).json(
        new ApiResponse(200,deletedTweet,"tweet updated successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}