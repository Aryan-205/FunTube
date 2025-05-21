import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {context, videoId} = req.body
    const userId = req.user.id 
    if(context.trim()===''){
        throw new ApiError(400,"Comment missing")
    }

    if(!videoId){
        throw new ApiError(400,"Video not found")
    }

    const comment = await Comment.create({
        context,
        video:videoId,
        owner:userId
    })

    if(!comment){
        throw new ApiError(400,"Comment update unsuccessful")
    }

    return res.status(200).json(
        new ApiResponse(200,comment,"Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId, newComment} = req.body

    if(!commentId || !newComment){
        throw new ApiError(400,"All field are required")
    }

    const userId =  req.user._id

    if(!userId){
        throw new ApiError(400,"user not found")
    }
    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400,"cannot find comment")
    }

    if(!comment.owner.equals(userId)){
        throw new ApiError(403,"You cannot edit this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
        $set: {
            context:newComment,
        },
    },
        { new: true }
    );

    if(!updatedComment){
        throw new ApiError(400,"Comment update unsuccessful")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "comment updated successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.body
    const userId = req.user.id

    if(!commentId || !userId){
        throw new ApiError(400,"couldnt find comment")
    }
    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "Couldn't find comment")
    }
    if (!comment.owner.equals(userId)) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    return res 
        .status(200)
        .json(
            new ApiResponse(200,deletedComment,"Comment deleted successfully")
        )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }