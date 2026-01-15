import { RequestHandler } from "express";
import { and, eq } from "drizzle-orm";

import db from "../../../../db";
import {
  hotelAmenities,
  hotels,
  hotelUsers,
  properties,
 
} from "../../../../db/schema";

import hotelPolicies from "../../../../db/schema/hotel_policies";
import CustomErrorHandler from "../../../../Services/customErrorHandaler";
import { uploadToCloudinary } from "../../../../utils/cloudinary";
import hotelDocuments from "../../../../db/schema/hotel_documents";

/* ================================================= */

export const submitHotelForVerification: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user!.id;
    const { hotelId } = req.params;

    /* ================= PARSE BODY ================= */

    const property = JSON.parse(req.body.property);
    const policies = JSON.parse(req.body.policies);
    const amenityIds: string[] = JSON.parse(req.body.amenityIds);

    const files = req.files as Express.Multer.File[];
    const documentTypes = req.body.documentTypes;

    const typesArray = Array.isArray(documentTypes)
      ? documentTypes
      : [documentTypes];

    /* ================= OWNERSHIP CHECK ================= */

    const access = await db.query.hotelUsers.findFirst({
      where: and(
        eq(hotelUsers.userId, userId),
        eq(hotelUsers.hotelId, hotelId)
      ),
    });

    if (!access) {
      return next(CustomErrorHandler.unAuthorized("No access"));
    }

    /* ================= PROPERTY ================= */

    const existingProperty = await db.query.properties.findFirst({
      where: eq(properties.hotelId, hotelId),
    });

    if (!existingProperty) {
      await db.insert(properties).values({
        hotelId,
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        state: property.state,
        country: property.country,
        zip: property.zip,
        location: property.location,
      });
    }

    /* ================= POLICIES ================= */

    await db
      .insert(hotelPolicies)
      .values({ hotelId, ...policies });

    /* ================= AMENITIES ================= */

    await db
      .delete(hotelAmenities)
      .where(eq(hotelAmenities.hotelId, hotelId));

    await db.insert(hotelAmenities).values(
      amenityIds.map((id) => ({
        hotelId,
        amenityId: id,
      }))
    );

    /* ================= DOCUMENTS (CLOUDINARY) ================= */

    if (files?.length) {
      const uploadedDocs = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const type = typesArray[i];

        const cloudUrl = await uploadToCloudinary(
          file.path,
          "hotel-documents"
        );

        uploadedDocs.push({
          hotelId,
          type,
          fileUrl: cloudUrl,
          uploadedBy: userId,
        });
      }

      await db.insert(hotelDocuments).values(uploadedDocs);
    }

    /* ================= STATUS ================= */

    await db
      .update(hotels)
      .set({
        verified: false,
      })
      .where(eq(hotels.id, hotelId));

    /* ================= RESPONSE ================= */

    res.status(200).json({
      message: "Hotel submitted for verification",
    });
  } catch (err) {
    next(err);
  }
};
