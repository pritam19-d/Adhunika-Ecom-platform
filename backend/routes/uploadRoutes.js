import path from "path"
import express from "express"
import multer from "multer"
import dotenv from "dotenv"
dotenv.config();
import { v2 as cloudinary } from "cloudinary"
const router = express.Router()

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, "uploads/")
  },
  filename(req, file, cb){
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb("Images only!")
  }
}

const upload = multer({
  storage
})

router.post("/", upload.single("image"), async (req, res)=>{
  try {
    const file = req.file.path;
    const result = await cloudinary.uploader.upload(file, {
      folder: 'products', // specify folder in Cloudinary
    });
    res.status(200).json({
      message: "Image Uploaded",
      image: `/${req.file.path}`,
      secure_url: result.secure_url
    })
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed', details: error });
  }
})

export default router