import { and, desc, eq, ilike, or } from "drizzle-orm";
import { RequestHandler } from "express";
import db from "../../../db";
import {
  amenities,
  hotelAmenities,
  hotelPolicies,
  hotels,
  properties,
  reviews,
  rooms,
  users,
} from "../../../db/schema";

function toPublicProperty(property: any) {
  const ratings = property.reviews ?? [];
  const averageRating = ratings.length
    ? ratings.reduce((sum: number, item: any) => sum + item.rating, 0) / ratings.length
    : 0;

  const prices = (property.rooms ?? []).map((room: any) => Number(room.pricePerDay));
  const minPricePerDay = prices.length ? Math.min(...prices) : null;

  return {
    ...property,
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount: ratings.length,
    minPricePerDay,
  };
}

export const listProperties: RequestHandler = async (req, res, next) => {
  try {
    const { q, city, state, country } = req.query;
    const filters = [];

    if (typeof q === "string" && q.trim()) {
      const value = `%${q.trim()}%`;
      filters.push(
        or(
          ilike(properties.title, value),
          ilike(properties.description, value),
          ilike(properties.address, value),
          ilike(properties.city, value)
        )
      );
    }

    if (typeof city === "string" && city.trim()) {
      filters.push(ilike(properties.city, `%${city.trim()}%`));
    }

    if (typeof state === "string" && state.trim()) {
      filters.push(ilike(properties.state, `%${state.trim()}%`));
    }

    if (typeof country === "string" && country.trim()) {
      filters.push(ilike(properties.country, `%${country.trim()}%`));
    }

    const data = await db.query.properties.findMany({
      where: filters.length ? and(...filters) : undefined,
      orderBy: [desc(properties.createdAt)],
      with: {
        hotel: {
          columns: {
            id: true,
            name: true,
            contact: true,
            verified: true,
            status: true,
          },
        },
        images: {
          columns: {
            id: true,
            url: true,
          },
        },
        rooms: {
          columns: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true,
            pricePerDay: true,
            capacity: true,
          },
        },
        reviews: {
          columns: {
            id: true,
            rating: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Properties fetched successfully",
      data: data.map(toPublicProperty),
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyDetails: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, id),
      with: {
        hotel: {
          columns: {
            id: true,
            name: true,
            contact: true,
            verified: true,
            status: true,
          },
        },
        images: {
          columns: {
            id: true,
            url: true,
          },
        },
        rooms: {
          with: {
            images: {
              columns: {
                id: true,
                url: true,
              },
            },
            availabilities: true,
          },
        },
        reviews: {
          orderBy: [desc(reviews.createdAt)],
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const hotelAmenityRows = await db
      .select({
        id: amenities.id,
        name: amenities.name,
      })
      .from(hotelAmenities)
      .innerJoin(amenities, eq(hotelAmenities.amenityId, amenities.id))
      .where(eq(hotelAmenities.hotelId, property.hotelId));

    const policies = await db.query.hotelPolicies.findMany({
      where: eq(hotelPolicies.hotelId, property.hotelId),
    });

    res.status(200).json({
      message: "Property fetched successfully",
      data: {
        ...toPublicProperty(property),
        amenities: hotelAmenityRows,
        policies,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelDetails: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hotel = await db.query.hotels.findFirst({
      where: eq(hotels.id, id),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        properties: {
          with: {
            images: {
              columns: {
                id: true,
                url: true,
              },
            },
            rooms: true,
            reviews: {
              columns: {
                id: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }

    const hotelAmenityRows = await db
      .select({
        id: amenities.id,
        name: amenities.name,
      })
      .from(hotelAmenities)
      .innerJoin(amenities, eq(hotelAmenities.amenityId, amenities.id))
      .where(eq(hotelAmenities.hotelId, hotel.id));

    const policies = await db.query.hotelPolicies.findMany({
      where: eq(hotelPolicies.hotelId, hotel.id),
    });

    res.status(200).json({
      message: "Hotel fetched successfully",
      data: {
        ...hotel,
        properties: hotel.properties.map(toPublicProperty),
        amenities: hotelAmenityRows,
        policies,
      },
    });
  } catch (error) {
    next(error);
  }
};
