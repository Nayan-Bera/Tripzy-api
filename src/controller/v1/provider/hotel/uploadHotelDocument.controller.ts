import { RequestHandler } from "express"
import { eq } from "drizzle-orm"
import db from "../../../../db"
import hotelDocuments from "../../../../db/schema/hotel_documents"
import CustomErrorHandler from "../../../../Services/customErrorHandaler"

export const uploadHotelDocument: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?.id
    const hotelId = req.params.hotelId
    const { type } = req.body // license | tax | id | other

    if (!req.file || !req.file.path) {
      return next(CustomErrorHandler.notFound("File missing"))
    }

    await db.insert(hotelDocuments).values({
      hotelId,
      type,
      fileUrl: req.file.path, // Cloudinary URL
      uploadedBy: userId!,
      verified: false,
    })

    res.status(201).json({
      message: "Document uploaded successfully",
      fileUrl: req.file.path,
    })
  } catch (error) {
    next(error)
  }
}
