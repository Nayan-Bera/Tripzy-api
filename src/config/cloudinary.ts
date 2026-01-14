import { v2 as cloudinary } from "cloudinary"
import { config } from "./index"

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_APIKEY,
  api_secret: config.CLOUDINARY_APISECRET,
})

export default cloudinary
