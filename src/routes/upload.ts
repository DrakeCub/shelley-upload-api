import { Router, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../lib/s3";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// npm install uuid @types/uuid
const router = Router();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, `videos/${uniqueName}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

router.post(
  "/",
  upload.single("video"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.MulterS3.File;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Save metadata to Supabase
      const { error } = await supabase.from("videos").insert({
        filename: file.originalname,
        s3_key: file.key,
        s3_url: file.location,
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_at: new Date().toISOString(),
      });

      if (error) throw error;

      return res.status(200).json({
        message: "Upload successful",
        url: file.location,
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: err.message || "Upload failed" });
    }
  },
);

export default router;
