import multer from "multer";

// data is saved on computer hard disk
const storage = multer.diskStorage({
  // saved at this location
    destination: function (req, file, cb) {
      //cb is callback, the saving location
      cb(null, "./public/temp")
    },
    // what should be the name of the saved file
    filename: function (req, file, cb) {
      // save them by original filename
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})