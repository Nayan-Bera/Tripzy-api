// src/controllers/admin/createHotel.controller.ts
import { RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import { createHotelSchema } from '../../../../validators/admin/hotel/hotel.validetor';
import { hotels, hotelUsers, role, users } from '../../../../db/schema';
import db from '../../../../db';
import ResponseHandler from '../../../../utils/responseHandealer';

export const createHotel: RequestHandler = async (req, res, next) => {
    try {
        const parsed = createHotelSchema.parse(req.body);
        const { name, contact, ownerEmail } = parsed;

        /*Find owner */
        const owner = await db.query.users.findFirst({
            where: eq(users.email, ownerEmail),
        });

        if (!owner) {
            res.status(404).json({
                message: 'User not found',
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
export const getAllHotel: RequestHandler = async (req, res, next) => {
  try {
    const hotels = await db.query.hotels.findMany({
      with: {
        owner: {
          columns: { email: true },
        },
        properties: {
          columns: { id: true },
          with: {
            rooms: {
              columns: { id: true },
            },
            bookings: {
              columns: { id: true }, 
            },
          },
        },
      },
    });

    const formatted = hotels.map((hotel) => {
      const totalRooms = hotel.properties.reduce(
        (sum, property) => sum + property.rooms.length,
        0
      );

      const totalBookings = hotel.properties.reduce(
        (sum, property) => sum + property.bookings.length,
        0
      );

      return {
        id: hotel.id,
        name: hotel.name,
        ownerEmail: hotel.owner.email,
        contact: hotel.contact,
        verified: hotel.verified,
        status: hotel.status,
        totalRooms,
        totalBookings,
      };
    });

    res.status(200).json({
      message: "Hotels fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Get all hotels error:", error);
    res.status(500).json({
      message: "Failed to fetch hotels",
    });
    next(error);
  }
};

