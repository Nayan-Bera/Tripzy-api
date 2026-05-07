import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import db from "../../../../db";
import {
  hotelUsers,
  images,
  properties,
  roomAvailabilities,
  rooms,
} from "../../../../db/schema";

async function hasHotelAccess(userId: string, hotelId: string) {
  const access = await db.query.hotelUsers.findFirst({
    where: and(eq(hotelUsers.userId, userId), eq(hotelUsers.hotelId, hotelId)),
  });

  return Boolean(access);
}

async function propertyBelongsToUser(userId: string, propertyId: string) {
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
  });

  if (!property) {
    return null;
  }

  const hasAccess = await hasHotelAccess(userId, property.hotelId);
  return hasAccess ? property : null;
}

export const getHotelProperties: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { hotelId } = req.params;

    if (!(await hasHotelAccess(userId, hotelId))) {
      res.status(403).json({ message: "No access to this hotel" });
      return;
    }

    const data = await db.query.properties.findMany({
      where: eq(properties.hotelId, hotelId),
      with: {
        images: true,
        rooms: {
          with: {
            images: true,
            availabilities: true,
          },
        },
        reviews: true,
      },
    });

    res.status(200).json({
      message: "Properties fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { hotelId } = req.params;

    if (!(await hasHotelAccess(userId, hotelId))) {
      res.status(403).json({ message: "No access to this hotel" });
      return;
    }

    const {
      title,
      description,
      address,
      city,
      state,
      country,
      zip,
      location,
      imageUrls = [],
    } = req.body;

    const [property] = await db
      .insert(properties)
      .values({
        hotelId,
        title,
        description,
        address,
        city,
        state,
        country,
        zip,
        location,
      })
      .returning();

    if (Array.isArray(imageUrls) && imageUrls.length) {
      await db.insert(images).values(
        imageUrls.map((url: string) => ({
          propertyId: property.id,
          url,
          uploadedBy: userId,
        }))
      );
    }

    res.status(201).json({
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;
    const property = await propertyBelongsToUser(userId, propertyId);

    if (!property) {
      res.status(404).json({ message: "Property not found or no access" });
      return;
    }

    const [updated] = await db
      .update(properties)
      .set({
        ...(req.body.title !== undefined ? { title: req.body.title } : {}),
        ...(req.body.description !== undefined ? { description: req.body.description } : {}),
        ...(req.body.address !== undefined ? { address: req.body.address } : {}),
        ...(req.body.city !== undefined ? { city: req.body.city } : {}),
        ...(req.body.state !== undefined ? { state: req.body.state } : {}),
        ...(req.body.country !== undefined ? { country: req.body.country } : {}),
        ...(req.body.zip !== undefined ? { zip: req.body.zip } : {}),
        ...(req.body.location !== undefined ? { location: req.body.location } : {}),
      })
      .where(eq(properties.id, propertyId))
      .returning();

    res.status(200).json({
      message: "Property updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;
    const property = await propertyBelongsToUser(userId, propertyId);

    if (!property) {
      res.status(404).json({ message: "Property not found or no access" });
      return;
    }

    await db.delete(properties).where(eq(properties.id, propertyId));

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;
    const property = await propertyBelongsToUser(userId, propertyId);

    if (!property) {
      res.status(404).json({ message: "Property not found or no access" });
      return;
    }

    const {
      name,
      type,
      pricePerHour,
      pricePerDay,
      capacity,
      imageUrls = [],
      availabilities,
    } = req.body;

    const [room] = await db
      .insert(rooms)
      .values({
        propertyId,
        name,
        type,
        pricePerHour,
        pricePerDay,
        capacity: Number(capacity),
      })
      .returning();

    if (Array.isArray(imageUrls) && imageUrls.length) {
      await db.insert(images).values(
        imageUrls.map((url: string) => ({
          roomId: room.id,
          url,
          uploadedBy: userId,
        }))
      );
    }

    if (Array.isArray(availabilities) && availabilities.length) {
      await db.insert(roomAvailabilities).values(
        availabilities.map((item: any) => ({
          roomId: room.id,
          dayOfWeek: Number(item.dayOfWeek),
          openTime: item.openTime,
          closeTime: item.closeTime,
        }))
      );
    }

    res.status(201).json({
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { roomId } = req.params;

    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, roomId),
    });

    if (!room || !(await propertyBelongsToUser(userId, room.propertyId))) {
      res.status(404).json({ message: "Room not found or no access" });
      return;
    }

    const [updated] = await db
      .update(rooms)
      .set({
        ...(req.body.name !== undefined ? { name: req.body.name } : {}),
        ...(req.body.type !== undefined ? { type: req.body.type } : {}),
        ...(req.body.pricePerHour !== undefined ? { pricePerHour: req.body.pricePerHour } : {}),
        ...(req.body.pricePerDay !== undefined ? { pricePerDay: req.body.pricePerDay } : {}),
        ...(req.body.capacity !== undefined ? { capacity: Number(req.body.capacity) } : {}),
      })
      .where(eq(rooms.id, roomId))
      .returning();

    res.status(200).json({
      message: "Room updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { roomId } = req.params;

    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, roomId),
    });

    if (!room || !(await propertyBelongsToUser(userId, room.propertyId))) {
      res.status(404).json({ message: "Room not found or no access" });
      return;
    }

    await db.delete(rooms).where(eq(rooms.id, roomId));

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
