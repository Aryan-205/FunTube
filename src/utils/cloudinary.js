import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (cloudUrl) => {
    try {
        // Extract the public ID from the URL
        const publicId = cloudUrl.split("/").pop().split(".")[0];

        // Delete the file using the public ID
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted:", result);
    
        return result;
        } catch (error) {
        console.error("Error deleting file:", error);
        }
    };



export {uploadOnCloudinary,deleteFromCloudinary}