// src/controllers/admin/createHotel.controller.ts
import { RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import { createHotelSchema } from '../../../../validators/admin/hotel/hotel.validetor';
import { hotels, hotelUsers, role, users } from '../../../../db/schema';
import db from '../../../../db';


export const createHotel: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createHotelSchema.parse(req.body);
    const { name, contact, ownerEmail} = parsed;

    /*Find owner */
    const owner = await db.query.users.findFirst({
      where: eq(users.email, ownerEmail),
    });

    if (!owner) {
      res.status(404).json({
        message: 'Owner not found',
      });
      return;
    }

    /* Create hotel (UNVERIFIED) */
    const [hotel] = await db
      .insert(hotels)
      .values({
        name,
        contact,
        ownerId: owner.id, 
        verified: false,
      })
      .returning();

    /* Attach OWNER role */
    const ownerRole = await db.query.role.findFirst({
      where: eq(role.name, 'hotel_owner'),
    });

    if (!ownerRole) {
      throw new Error('HOTEL OWNER role missing');
    }

    await db.insert(hotelUsers).values({
      userId: owner.id,
      hotelId: hotel.id,
      roleId: ownerRole.id,
    });

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel,
    });
  } catch (err) {
    next(err);
  }
};
