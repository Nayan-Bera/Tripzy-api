import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: any) => {
    const hotelId = req.params.hotelId || "general"

    return {
      folder: `hotels/${hotelId}/documents`,
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "pdf"],
    }
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})
