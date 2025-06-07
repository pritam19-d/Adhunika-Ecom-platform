import path from "path";
import fs from "fs";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();

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

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("Images only!"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
})

router.post("/", upload.single("image"), async (req, res)=>{
  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'products', // specify folder in Cloudinary
      resource_type: 'image', // specify resource type
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    fs.unlinkSync(filePath); // Delete the local file after upload
  
    res.status(200).json({
      message: "Image Uploaded",
      image: `/${filePath}`,
      secure_url: result.secure_url
    })
  } catch (error) {
    res.status(500).json({ error: "Image upload failed", details: error });
  }
})

export default router;

// ********************** Google Drive Upload Code ********************** //

// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import drive from "../config/googleDrive.js";
// // import { uploadImageToDrive } from "../controllers/uploadController.js";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// function fileFilter(req, file, cb) {
//   const filetypes = /jpg|jpeg|png|webp/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);
//   if (extname && mimetype) {
//     return cb(null, true)
//   } else {
//     cb(new Error("Please upload an image file (jpg/ jpeg/ png)"), false);
//   }
// }

// const upload = multer({ storage, fileFilter });

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const filePath = req.file.path;

//     const fileMetadata = {
//       name: req.file.filename,
//       parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
//     };

//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(filePath),
//     };

//     const driveResponse = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: "id",
//     });

//     const driveFileId = driveResponse.data.id;

//     await drive.permissions.create({
//       fileId: driveFileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     fs.unlinkSync(filePath);

//     res.status(200).json({
//       message: "File uploaded to Google Drive",
//       driveFileId,
//       publicUrl: `https://drive.google.com/uc?id=${driveFileId}`,
//     });
//   } catch (error) {
//     console.log("Google Drive upload error:", error);
//     res.status(500).json({ error: "Google Drive upload failed", details: error.message });
//   }
// });

// export default router;
